import { useEffect, useRef } from "react";
import L from "leaflet";
import { useMap } from "react-leaflet";

export type BasemapMode = "street" | "satellite";

type Provider = { url: string; options: L.TileLayerOptions };

/**
 * Các nguồn tile nền, xếp theo thứ tự ưu tiên — TẤT CẢ đều không cần API key.
 *
 * LƯU Ý QUAN TRỌNG: CARTO (basemaps.cartocdn.com) trước đây được dùng làm nguồn
 * chính nhưng hiện đã YÊU CẦU API KEY. Khi thiếu key, máy chủ vẫn trả về HTTP 200
 * kèm ảnh chữ "API KEY REQUIRED" => Leaflet coi là tải thành công, không phát
 * sinh `tileerror` nên cơ chế tự chuyển nguồn dự phòng không bao giờ kích hoạt.
 * Vì vậy đã loại bỏ hoàn toàn CARTO.
 */
const referrerPolicy = "strict-origin-when-cross-origin" as const;

const BASEMAP_PROVIDERS: Record<BasemapMode, Provider[]> = {
  street: [
    {
      url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      options: {
        subdomains: "abc",
        maxZoom: 19,
        referrerPolicy,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      },
    },
    {
      url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}",
      options: {
        maxZoom: 19,
        referrerPolicy,
        attribution: "Tiles &copy; Esri — Source: Esri, HERE, Garmin, FAO, NOAA, USGS",
      },
    },
    {
      url: "https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png",
      options: {
        subdomains: "abc",
        maxZoom: 20,
        referrerPolicy,
        attribution: '&copy; <a href="https://www.openstreetmap.fr">OpenStreetMap France</a> &amp; contributors',
      },
    },
  ],
  satellite: [
    {
      url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      options: {
        maxZoom: 19,
        referrerPolicy,
        attribution: "Tiles &copy; Esri — Source: Esri, Maxar, Earthstar Geographics, and the GIS User Community",
      },
    },
  ],
};

const MAX_ERRORS_BEFORE_SWITCH = 6;

interface Props {
  mode?: BasemapMode;
  onAllProvidersFailed?: () => void;
  onRecovered?: () => void;
}

/**
 * Lớp nền bản đồ có khả năng tự chuyển nguồn dự phòng khi tile lỗi liên tục.
 *
 * Các callback được giữ qua ref nên việc component cha re-render (gõ tìm kiếm,
 * đổi bộ lọc...) KHÔNG làm gỡ/dựng lại lớp tile (nguyên nhân gây nháy/lag trước đây).
 */
export function ResilientBasemap({ mode = "street", onAllProvidersFailed, onRecovered }: Props) {
  const map = useMap();
  const failedRef = useRef(onAllProvidersFailed);
  const recoveredRef = useRef(onRecovered);
  useEffect(() => {
    failedRef.current = onAllProvidersFailed;
    recoveredRef.current = onRecovered;
  }, [onAllProvidersFailed, onRecovered]);

  useEffect(() => {
    const providers = BASEMAP_PROVIDERS[mode];
    let providerIndex = 0;
    let errorCount = 0;
    let reportedFailure = false;
    let currentLayer: L.TileLayer | null = null;
    let cancelled = false;

    function mountProvider(index: number) {
      if (cancelled) return;
      const provider = providers[index];
      const layer = L.tileLayer(provider.url, provider.options);

      layer.on("tileerror", () => {
        if (cancelled || layer !== currentLayer) return;
        errorCount += 1;
        if (errorCount >= MAX_ERRORS_BEFORE_SWITCH) {
          if (providerIndex < providers.length - 1) {
            const failedLayer = currentLayer;
            providerIndex += 1;
            errorCount = 0;
            mountProvider(providerIndex);
            if (failedLayer) map.removeLayer(failedLayer);
          } else if (!reportedFailure) {
            reportedFailure = true;
            failedRef.current?.();
          }
        }
      });

      layer.on("tileload", () => {
        errorCount = 0;
        if (reportedFailure) {
          reportedFailure = false;
          recoveredRef.current?.();
        }
      });

      layer.addTo(map);
      layer.bringToBack();
      currentLayer = layer;
    }

    mountProvider(providerIndex);

    return () => {
      cancelled = true;
      if (currentLayer) map.removeLayer(currentLayer);
    };
  }, [map, mode]);

  return null;
}
