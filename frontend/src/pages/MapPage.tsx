import { useEffect, useMemo, useState } from "react";
import { MapView } from "../components/Map/MapView";
import { SearchBar } from "../components/Search/SearchBar";
import { CategoryFilter } from "../components/CategoryFilter/CategoryFilter";
import { SiteHeader } from "../components/Layout/SiteHeader";
import { SiteFooter } from "../components/Layout/SiteFooter";
import { api } from "../services/api";
import type { Category, Location } from "../types/location";

// Dữ liệu mẫu dùng khi chưa kết nối Backend (ví dụ khi chạy `npm run dev`
// mà chưa bật ASP.NET Core API). Khi Backend đã chạy, dữ liệu thật từ
// /api/locations, /api/categories, /api/map/boundary sẽ được ưu tiên dùng.
import fallbackLocations from "../data/locations.json";
import fallbackCategories from "../data/categories.json";

export function MapPage() {
  const [locations, setLocations] = useState<Location[]>(fallbackLocations as Location[]);
  const [categories, setCategories] = useState<Category[]>(fallbackCategories as Category[]);
  const [boundary, setBoundary] = useState<GeoJSON.FeatureCollection | null>(null);
  const [usingFallback, setUsingFallback] = useState(true);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  useEffect(() => {
    // Thử tải từ Backend thật; nếu lỗi (chưa chạy Backend) thì giữ dữ liệu mẫu.
    Promise.all([api.getLocations(), api.getCategories()])
      .then(([locs, cats]) => {
        setLocations(locs);
        setCategories(cats);
        setUsingFallback(false);
      })
      .catch(() => setUsingFallback(true));

    fetch("/map/hung-long.geojson")
      .then((r) => r.json())
      .then(setBoundary)
      .catch(() => setBoundary(null));
  }, []);

  const filtered = useMemo(() => {
    return locations.filter((loc) => {
      const matchesCategory = !activeCategory || loc.categoryId === activeCategory;
      const matchesSearch = loc.name.toLowerCase().includes(search.trim().toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [locations, search, activeCategory]);

  return (
    <div style={{ height: "100dvh", width: "100vw", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <SiteHeader />

      <div style={{ position: "relative", flex: 1, minHeight: 0 }}>
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 1000,
            padding: "14px 16px",
            display: "flex",
            flexDirection: "column",
            gap: 10,
            background: "linear-gradient(180deg, rgba(246,239,228,0.96) 0%, rgba(246,239,228,0) 100%)",
            pointerEvents: "none",
          }}
        >
          <div style={{ pointerEvents: "auto", maxWidth: 420 }}>
            <SearchBar value={search} onChange={setSearch} />
          </div>

          <div style={{ pointerEvents: "auto" }}>
            <CategoryFilter categories={categories} activeId={activeCategory} onChange={setActiveCategory} />
          </div>

          {usingFallback && (
            <div
              style={{
                pointerEvents: "auto",
                alignSelf: "flex-start",
                fontSize: 12,
                background: "#FFF4D9",
                color: "#8A6A16",
                border: "1px solid #E9CE84",
                padding: "5px 10px",
                borderRadius: 8,
              }}
            >
              Đang hiển thị dữ liệu mẫu — chưa kết nối được Backend API.
            </div>
          )}
        </div>

        <MapView locations={filtered} categories={categories} boundary={boundary} />
      </div>

      <SiteFooter />
    </div>
  );
}
