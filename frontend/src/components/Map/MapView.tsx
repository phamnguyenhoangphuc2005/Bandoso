import { useEffect, useState } from "react";
import L from "leaflet";
import { MapContainer, TileLayer, Marker, Popup, GeoJSON, useMap } from "react-leaflet";
import type { Category, Location } from "../../types/location";
import { createCategoryIcon } from "../Marker/CategoryMarker";
import { LocationPopup } from "../Popup/LocationPopup";
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

export function MapView({ locations, categories, boundary }: Props) {
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);

  const categoryById = Object.fromEntries(categories.map((c) => [c.id, c]));

  return (
    <MapContainer
      center={HUNG_LONG_CENTER}
      zoom={13}
      style={{ width: "100%", height: "100%" }}
      scrollWheelZoom
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {boundary && (
        <GeoJSON
          data={boundary as any}
          style={{
            color: "#B8202A",
            weight: 3,
            fillColor: "#B8202A",
            fillOpacity: 0.06,
          }}
        />
      )}

      {boundary && <FitToBoundary boundary={boundary} />}

      {ready &&
        locations.map((loc) => (
          <Marker
            key={loc.id}
            position={[loc.latitude, loc.longitude]}
            icon={createCategoryIcon(categoryById[loc.categoryId])}
          >
            <Popup>
              <LocationPopup location={loc} category={categoryById[loc.categoryId]} />
            </Popup>
          </Marker>
        ))}
    </MapContainer>
  );
}
