import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MapContainer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { api } from "../services/api";
import type { Category, Location } from "../types/location";
import { createCategoryIcon } from "../components/Marker/CategoryMarker";
import { ResilientBasemap } from "../components/Map/ResilientBasemap";
import { SiteHeader } from "../components/Layout/SiteHeader";
import { SiteFooter } from "../components/Layout/SiteFooter";

import fallbackLocations from "../data/locations.json";
import fallbackCategories from "../data/categories.json";

export function LocationDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [location, setLocation] = useState<Location | null>(null);
  const [category, setCategory] = useState<Category | undefined>(undefined);

  useEffect(() => {
    if (!id) return;
    api
      .getLocationById(id)
      .then(async (loc) => {
        setLocation(loc);
        const cats = await api.getCategories();
        setCategory(cats.find((c) => c.id === loc.categoryId));
      })
      .catch(() => {
        const loc = (fallbackLocations as Location[]).find((l) => l.id === id) ?? null;
        setLocation(loc);
        setCategory((fallbackCategories as Category[]).find((c) => c.id === loc?.categoryId));
      });
  }, [id]);

  const openDirections = () => {
    if (!location) return;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${location.latitude},${location.longitude}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div style={{ minHeight: "100dvh", display: "flex", flexDirection: "column" }}>
      <SiteHeader />

      <div style={{ flex: 1, background: "var(--color-bg)" }}>
        {!location ? (
          <div style={{ padding: 40, fontFamily: "Inter, sans-serif", textAlign: "center" }}>
            <p>Đang tải thông tin địa điểm...</p>
            <button onClick={() => navigate("/")} style={{ border: "none", background: "none", color: "#26658C", fontWeight: 600 }}>
              ← Quay lại bản đồ
            </button>
          </div>
        ) : (
          <div style={{ maxWidth: 880, margin: "0 auto", padding: "24px 16px 60px" }}>
            <button
              onClick={() => navigate("/")}
              style={{
                border: "none",
                background: "none",
                color: "#26658C",
                fontWeight: 700,
                fontSize: 14,
                marginBottom: 16,
                padding: 0,
              }}
            >
              ← Quay lại bản đồ
            </button>

            {location.images[0] && (
              <div style={{ position: "relative", borderRadius: "var(--radius)", overflow: "hidden", boxShadow: "var(--shadow-card)" }}>
                <img
                  src={location.images[0]}
                  alt={location.name}
                  style={{ width: "100%", height: "clamp(220px, 40vw, 340px)", objectFit: "cover", display: "block" }}
                />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0) 55%, rgba(0,0,0,0.45) 100%)" }} />
              </div>
            )}

            <div style={{ marginTop: 20 }}>
              <span
                style={{
                  display: "inline-block",
                  fontSize: 12,
                  fontWeight: 700,
                  color: "#fff",
                  background: category?.color ?? "#26658C",
                  padding: "4px 12px",
                  borderRadius: 999,
                  marginBottom: 10,
                  letterSpacing: 0.3,
                }}
              >
                {category?.name}
              </span>
              <h1 style={{ fontSize: "clamp(24px, 4vw, 32px)", marginBottom: 8 }}>{location.name}</h1>
              <p style={{ color: "#285A78", fontSize: 15, marginBottom: 20 }}>📍 {location.address}</p>

              <button
                onClick={openDirections}
                style={{
                  background: "var(--accent-grad)",
                  color: "#fff",
                  border: "none",
                  borderRadius: 12,
                  padding: "13px 24px",
                  fontSize: 14.5,
                  fontWeight: 700,
                  marginBottom: 28,
                  boxShadow: "var(--shadow-card)",
                }}
              >
                🧭 Chỉ đường tới đây
              </button>

              <section
                style={{
                  marginBottom: 20,
                  background: "#fff",
                  border: "1px solid var(--color-border)",
                  borderRadius: "var(--radius)",
                  padding: 20,
                }}
              >
                <h2 style={{ fontSize: 19, marginBottom: 8 }}>Mô tả</h2>
                <p style={{ lineHeight: 1.7, color: "#0F2E45", margin: 0 }}>{location.description}</p>
              </section>

              <section
                style={{
                  marginBottom: 20,
                  background: "#fff",
                  border: "1px solid var(--color-border)",
                  borderRadius: "var(--radius)",
                  padding: 20,
                }}
              >
                <h2 style={{ fontSize: 19, marginBottom: 8 }}>Lịch sử</h2>
                <p style={{ lineHeight: 1.7, color: "#0F2E45", margin: 0 }}>{location.history}</p>
              </section>

              {location.videos.length > 0 && (
                <section style={{ marginBottom: 20 }}>
                  <h2 style={{ fontSize: 19, marginBottom: 8 }}>Video</h2>
                  {location.videos.map((v) => (
                    <video key={v} src={v} controls style={{ width: "100%", borderRadius: 12 }} />
                  ))}
                </section>
              )}

              <section>
                <h2 style={{ fontSize: 19, marginBottom: 8 }}>Vị trí trên bản đồ</h2>
                <div
                  style={{
                    height: 280,
                    borderRadius: "var(--radius)",
                    overflow: "hidden",
                    boxShadow: "var(--shadow-card)",
                  }}
                >
                  <MapContainer
                    center={[location.latitude, location.longitude]}
                    zoom={16}
                    style={{ width: "100%", height: "100%" }}
                    scrollWheelZoom={false}
                  >
                    <ResilientBasemap />
                    <Marker
                      position={[location.latitude, location.longitude]}
                      icon={createCategoryIcon(category)}
                    />
                  </MapContainer>
                </div>
              </section>
            </div>
          </div>
        )}
      </div>

      <SiteFooter />
    </div>
  );
}
