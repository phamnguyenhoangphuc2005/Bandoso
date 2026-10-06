import { useEffect, useMemo, useRef, useState } from "react";
import L from "leaflet";
import { MapContainer, Marker, Popup, GeoJSON, ZoomControl, useMap } from "react-leaflet";
import type { Category, Location } from "../../types/location";
import { createCategoryIcon } from "../Marker/CategoryMarker";
import { LocationPopup } from "../Popup/LocationPopup";
import { ResilientBasemap } from "./ResilientBasemap";
import "leaflet/dist/leaflet.css";

const HUNG_LONG_CENTER: [number, number] = [10.6593, 106.6457];

interface Props {
  locations: Location[];
  categories: Category[];
  boundary: GeoJSON.FeatureCollection | null;
}

function FitToBoundary({ boundary }: { boundary: GeoJSON.FeatureCollection | null }) {
  const map = useMap();
  useEffect(() => {
    if (!boundary) return;
    try {
      const layer = L.geoJSON(boundary);
      const bounds = layer.getBounds();
      if (bounds.isValid()) map.fitBounds(bounds, { padding: [24, 24] });
    } catch {
      // ignore
    }
  }, [boundary, map]);
  return null;
}

/**
 * Lấy toàn bộ các "ring" toạ độ (vòng ngoài + lỗ) từ một FeatureCollection
 * Polygon/MultiPolygon, dùng để đục lỗ lên lớp phủ làm mờ vùng xung quanh.
 * Leaflet vẽ Path bằng fill-rule "evenodd" nên không cần quan tâm chiều
 * vòng (clockwise/counter-clockwise) của từng ring.
 */
function extractAllRings(fc: GeoJSON.FeatureCollection): number[][][] {
  const rings: number[][][] = [];
  for (const feature of fc.features) {
    const geom = feature.geometry;
    if (!geom) continue;
    if (geom.type === "Polygon") {
      for (const ring of geom.coordinates) rings.push(ring as number[][]);
    } else if (geom.type === "MultiPolygon") {
      for (const polygon of geom.coordinates) {
        for (const ring of polygon) rings.push(ring as number[][]);
      }
    }
  }
  return rings;
}

/**
 * Lớp phủ "spotlight": làm tối toàn bộ bản đồ, chỉ để lộ sáng đúng vùng ranh giới xã.
 *
 * QUAN TRỌNG: vòng ngoài của lớp phủ được tính theo khung nhìn (viewport) hiện
 * tại của bản đồ — chứ KHÔNG dùng toạ độ cố định gần hết toàn cầu như bản
 * trước. Toạ độ cố định cực lớn (vd kinh độ ±179°) khi chiếu sang pixel ở mức
 * zoom sâu sẽ ra những con số cực lớn, khiến trình duyệt tính toán rất nặng
 * và gây giật/lag hoặc vỡ hình khi phóng to. Bám theo viewport giữ toạ độ
 * luôn ở mức hợp lý bất kể đang zoom sâu hay zoom xa.
 */
function SpotlightMask({ boundary }: { boundary: GeoJSON.FeatureCollection }) {
  const map = useMap();
  const layerRef = useRef<L.GeoJSON | null>(null);

  const holeRings = useMemo(() => extractAllRings(boundary), [boundary]);

  useEffect(() => {
    function buildFeature(): GeoJSON.Feature {
      // Mở rộng khung nhìn hiện tại thêm nhiều lần (pad) để lớp phủ luôn phủ
      // kín màn hình kể cả khi người dùng kéo/lê bản đồ trước lần cập nhật kế tiếp.
      const b = map.getBounds().pad(4);
      const outerRing: number[][] = [
        [b.getWest(), b.getSouth()],
        [b.getEast(), b.getSouth()],
        [b.getEast(), b.getNorth()],
        [b.getWest(), b.getNorth()],
        [b.getWest(), b.getSouth()],
      ];
      return {
        type: "Feature",
        properties: {},
        geometry: {
          type: "Polygon",
          coordinates: [outerRing, ...holeRings],
        },
      };
    }

    const layer = L.geoJSON(buildFeature() as any, {
      interactive: false,
      style: {
        stroke: false,
        fillColor: "#011C40",
        fillOpacity: 0.5,
        className: "hunglong-mask-path",
      },
    }).addTo(map);
    layerRef.current = layer;

    const update = () => {
      layer.clearLayers();
      layer.addData(buildFeature() as any);
    };
    map.on("moveend zoomend", update);

    return () => {
      map.off("moveend zoomend", update);
      map.removeLayer(layer);
      layerRef.current = null;
    };
  }, [map, holeRings]);

  return null;
}

export function MapView({ locations, categories, boundary }: Props) {
  const [ready, setReady] = useState(false);
  const [basemapFailed, setBasemapFailed] = useState(false);
  useEffect(() => setReady(true), []);

  const categoryById = Object.fromEntries(categories.map((c) => [c.id, c]));

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      {basemapFailed && (
        <div
          style={{
            position: "absolute",
            left: "50%",
            bottom: 16,
            transform: "translateX(-50%)",
            zIndex: 1300,
            background: "#5A1616",
            color: "#FFE3D9",
            fontSize: 12.5,
            fontWeight: 600,
            padding: "8px 14px",
            borderRadius: 10,
            boxShadow: "0 8px 20px rgba(0,0,0,0.35)",
            textAlign: "center",
            maxWidth: "88%",
          }}
        >
          Không tải được bản đồ nền — vui lòng kiểm tra kết nối mạng. Ranh giới và các địa điểm vẫn hiển thị bình thường.
        </div>
      )}
      <MapContainer
        center={HUNG_LONG_CENTER}
        zoom={13}
        style={{ width: "100%", height: "100%" }}
        scrollWheelZoom
        zoomControl={false}
      >
        <ResilientBasemap onAllProvidersFailed={() => setBasemapFailed(true)} />

        {boundary && <SpotlightMask boundary={boundary} />}

        {boundary && (
          <GeoJSON
            key="boundary-outline"
            data={boundary as any}
            interactive={false}
            style={{
              color: "#54ACBF",
              weight: 3.5,
              opacity: 1,
              dashArray: "9 6",
              fillOpacity: 0,
              className: "hunglong-boundary-glow",
            }}
          />
        )}

        {boundary && <FitToBoundary boundary={boundary} />}

        <ZoomControl position="bottomright" />

        {ready &&
          locations.map((loc) => (
            <Marker
              key={loc.id}
              position={[loc.latitude, loc.longitude]}
              icon={createCategoryIcon(categoryById[loc.categoryId], loc.images?.[0])}
            >
              <Popup>
                <LocationPopup location={loc} category={categoryById[loc.categoryId]} />
              </Popup>
            </Marker>
          ))}
      </MapContainer>
    </div>
  );
}
