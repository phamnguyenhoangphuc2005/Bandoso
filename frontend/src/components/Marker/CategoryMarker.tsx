import L from "leaflet";
import type { Category } from "../../types/location";

const ICONS: Record<string, string> = {
  landmark: "⛩",
  flag: "★",
  monument: "🕯",
};

/**
 * Icon marker dáng ghim bản đồ cổ điển (kiểu 📍): đầu tròn phía trên có thể
 * hiển thị ảnh đại diện của địa điểm, đuôi nhọn ở giữa chỉ đúng toạ độ.
 */
export function createCategoryIcon(category: Category | undefined, imageUrl?: string): L.DivIcon {
  const color = category?.color ?? "#26658C";
  const symbol = ICONS[category?.icon ?? ""] ?? "●";
  const hasImage = Boolean(imageUrl);

  const headStyle = hasImage
    ? `background-color:${color}; background-image:url('${imageUrl}');`
    : `background-color:${color};`;

  return L.divIcon({
    className: "",
    html: `
      <div class="marker-pin-wrap">
        <div class="marker-pin">
          <div class="marker-head${hasImage ? " has-image" : ""}" style="${headStyle}">
            <span>${symbol}</span>
          </div>
          <div class="marker-tail" style="border-top-color:${color}"></div>
          <div class="marker-tip-dot"></div>
        </div>
      </div>
    `,
    iconSize: [52, 58],
    iconAnchor: [26, 56],
    popupAnchor: [0, -52],
  });
}
