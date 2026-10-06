import type { Category, Location } from "../types/location";

// Địa chỉ gốc của Backend API (ASP.NET Core).
// Khi chạy backend cục bộ bằng Visual Studio, cổng mặc định thường là
// https://localhost:7xxx hoặc http://localhost:5xxx — hãy cập nhật lại
// giá trị dưới đây (hoặc tạo file .env với biến VITE_API_BASE_URL) cho khớp.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

async function request<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`);
  if (!res.ok) {
    throw new Error(`Lỗi gọi API ${path}: ${res.status} ${res.statusText}`);
  }
  return res.json() as Promise<T>;
}

export const api = {
  getLocations: () => request<Location[]>("/locations"),
  getLocationById: (id: string) => request<Location>(`/locations/${id}`),
  getCategories: () => request<Category[]>("/categories"),
  getMapBoundary: () => request<GeoJSON.FeatureCollection>("/map/boundary"),
};
