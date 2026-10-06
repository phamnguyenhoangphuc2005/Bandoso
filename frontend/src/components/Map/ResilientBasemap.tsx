import { useEffect } from "react";
import L from "leaflet";
import { useMap } from "react-leaflet";

/**
 * Danh sách các nguồn tile nền, xếp theo thứ tự ưu tiên.
 *
 * Trước đây trang chỉ gọi thẳng vào `tile.openstreetmap.org` — đây là máy chủ
 * demo miễn phí của cộng đồng OpenStreetMap, KHÔNG dành cho sản phẩm chạy
 * thật: nó áp dụng chính sách chống lạm dụng khá gắt (chặn theo Referer /
 * User-Agent, giới hạn số lượng request), nên rất dễ bị từ chối âm thầm khi
 * chạy trong môi trường nhúng/sandbox (ví dụ khung xem trước) hoặc khi có
 * nhiều người dùng thật truy cập cùng lúc — tile không tải được, nhưng vì
 * trình duyệt liên tục thử tải lại các ô tile khi lướt/zoom nên cảm giác là
 * "giật, lag", dù bản thân bản đồ (vector: ranh giới, marker...) vẫn chạy
 * mượt bình thường.
 *
 * Giải pháp: dùng CARTO Voyager (rastertiles) làm nguồn chính — đây là CDN
 * tile miễn phí, không cần API key, được nhiều sản phẩm thật sử dụng, ổn
 * định hơn nhiều so với tile.openstreetmap.org. Nếu vì lý do nào đó (mạng,
 * tường lửa, quá tải...) nguồn chính vẫn lỗi liên tục, component sẽ TỰ ĐỘNG
 * chuyển sang nguồn dự phòng kế tiếp mà không cần người dùng làm gì.
 */
export const BASEMAP_PROVIDERS: { url: string; options: L.TileLayerOptions }[] = [
  {
    // CARTO Voyager — CDN tile miễn phí, không cần API key, ổn định cho sản phẩm thật.
    url: "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
    options: {
      subdomains: "abcd",
      maxZoom: 20,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    },
  },
  {
    // Dự phòng 1: máy chủ tile chính thức của OpenStreetMap.
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    options: {
      subdomains: "abc",
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    },
  },
  {
    // Dự phòng 2: nền Esri World Street Map (miễn phí, không cần API key).
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}",
    options: {
      maxZoom: 19,
      attribution: "Tiles &copy; Esri — Source: Esri, HERE, Garmin, FAO, NOAA, USGS",
    },
  },
];

const MAX_ERRORS_BEFORE_SWITCH = 6;

/**
 * Lớp nền bản đồ (thay cho <TileLayer> tĩnh): tự dò lỗi và chuyển nguồn tile
 * dự phòng nếu nguồn hiện tại lỗi quá nhiều lần liên tiếp.
 *
 * @param onAllProvidersFailed Gọi khi TẤT CẢ nguồn tile đều đã thử và vẫn lỗi
 * liên tục (ví dụ thiết bị mất mạng hoàn toàn) — dùng để hiển thị cảnh báo
 * cho người dùng thay vì để bản đồ trắng trơn không rõ lý do.
 */
export function ResilientBasemap({ onAllProvidersFailed }: { onAllProvidersFailed?: () => void }) {
  const map = useMap();

  useEffect(() => {
    let providerIndex = 0;
    let errorCount = 0;
    let currentLayer: L.TileLayer | null = null;
    let cancelled = false;

    function mountProvider(index: number) {
      if (cancelled) return;
      const provider = BASEMAP_PROVIDERS[index];
      const layer = L.tileLayer(provider.url, provider.options);

      layer.on("tileerror", () => {
        errorCount += 1;
        if (errorCount >= MAX_ERRORS_BEFORE_SWITCH) {
          if (providerIndex < BASEMAP_PROVIDERS.length - 1) {
            const failedLayer = currentLayer;
            providerIndex += 1;
            errorCount = 0;
            mountProvider(providerIndex);
            if (failedLayer) map.removeLayer(failedLayer);
          } else {
            onAllProvidersFailed?.();
          }
        }
      });

      // Reset bộ đếm lỗi khi tile tải thành công, để những lỗi lẻ tẻ
      // (do mất mạng thoáng qua) không vô tình kích hoạt chuyển nguồn.
      layer.on("tileload", () => {
        errorCount = 0;
      });

      layer.addTo(map);
      currentLayer = layer;
    }

    mountProvider(providerIndex);

    return () => {
      cancelled = true;
      if (currentLayer) map.removeLayer(currentLayer);
    };
  }, [map, onAllProvidersFailed]);

  return null;
}
