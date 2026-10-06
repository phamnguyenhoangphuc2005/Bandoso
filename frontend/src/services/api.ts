import type { Category, Location } from "../types/location";

/**
 * Chế độ dữ liệu:
 *  - Có VITE_API_BASE_URL  -> gọi Backend ASP.NET Core (tự rơi về dữ liệu tĩnh nếu lỗi).
 *  - Không có (mặc định)   -> dùng dữ liệu tĩnh trong src/data + public/map.
 *    Đây là chế độ dành cho GitHub Pages (không có máy chủ backend).
 */
const RAW = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.trim();
export const API_BASE_URL = RAW ? RAW.replace(/\/+$/, "") : "";
export const API_ENABLED = API_BASE_URL.length > 0;

async function request<T>(path: string): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8000);
  try {
    const res = await fetch(`${API_BASE_URL}${path}`, { signal: controller.signal });
    if (!res.ok) {
      throw new Error(`Lỗi gọi API ${path}: ${res.status} ${res.statusText}`);
    }
    return (await res.json()) as T;
  } finally {
    clearTimeout(timer);
  }
}

export const api = {
  getLocations: () => request<Location[]>("/locations"),
  getLocationById: (id: string) => request<Location>(`/locations/${encodeURIComponent(id)}`),
  getCategories: () => request<Category[]>("/categories"),
  getMapBoundary: () => request<GeoJSON.FeatureCollection>("/map/boundary"),
};
