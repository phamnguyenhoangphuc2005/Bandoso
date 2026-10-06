import L from "leaflet";
import type { Category } from "../../types/location";

const ICONS: Record<string, string> = {
  landmark: "⛩",
  flag: "★",
  monument: "🕯",
};

export function createCategoryIcon(category: Category | undefined): L.DivIcon {
  const color = category?.color ?? "#B8202A";
  const symbol = ICONS[category?.icon ?? ""] ?? "●";

  return L.divIcon({
    className: "",
    html: `<div class="marker-pin" style="background:${color}"><span>${symbol}</span></div>`,
    iconSize: [34, 34],
    iconAnchor: [17, 32],
    popupAnchor: [0, -30],
  });
}
