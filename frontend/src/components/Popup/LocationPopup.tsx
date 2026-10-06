import { useNavigate } from "react-router-dom";
import type { Category, Location } from "../../types/location";

interface Props {
  location: Location;
  category: Category | undefined;
}

export function LocationPopup({ location, category }: Props) {
  const navigate = useNavigate();

  const openDirections = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${location.latitude},${location.longitude}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div style={{ fontFamily: "Inter, sans-serif" }}>
      {location.images[0] && (
        <img
          src={location.images[0]}
          alt={location.name}
          style={{ width: "100%", height: 130, objectFit: "cover", display: "block" }}
        />
      )}
      <div style={{ padding: "12px 14px" }}>
        <span
          style={{
            display: "inline-block",
            fontSize: 11,
            fontWeight: 600,
            color: "#fff",
            background: category?.color ?? "#26658C",
            padding: "2px 8px",
            borderRadius: 999,
            marginBottom: 6,
          }}
        >
          {category?.name ?? "Không rõ danh mục"}
        </span>
        <h3 style={{ fontSize: 16, lineHeight: 1.3, margin: "2px 0 4px" }}>{location.name}</h3>
        <p style={{ fontSize: 13, color: "#285A78", margin: "0 0 10px" }}>{location.address}</p>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={() => navigate(`/location/${location.id}`)}
            style={{
              flex: 1,
              background: "linear-gradient(135deg, #023859 0%, #26658C 60%, #54ACBF 100%)",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              padding: "8px 0",
              fontSize: 13,
              fontWeight: 700,
              boxShadow: "0 4px 12px rgba(2,56,89,0.35)",
            }}
          >
            Xem chi tiết
          </button>
          <button
            onClick={openDirections}
            style={{
              flex: 1,
              background: "#fff",
              color: "#023859",
              border: "1.5px solid #26658C",
              borderRadius: 8,
              padding: "8px 0",
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            Chỉ đường
          </button>
        </div>
      </div>
    </div>
  );
}
