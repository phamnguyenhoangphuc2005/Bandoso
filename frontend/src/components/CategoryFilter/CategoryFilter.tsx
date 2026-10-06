import type { Category } from "../../types/location";

interface Props {
  categories: Category[];
  activeId: string | null; // null = "Tất cả"
  onChange: (id: string | null) => void;
}

export function CategoryFilter({ categories, activeId, onChange }: Props) {
  const items: { id: string | null; name: string; color: string }[] = [
    { id: null, name: "Tất cả", color: "#011C40" },
    ...categories.map((c) => ({ id: c.id, name: c.name, color: c.color })),
  ];

  return (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
      {items.map((item) => {
        const active = item.id === activeId;
        return (
          <button
            key={item.id ?? "all"}
            onClick={() => onChange(item.id)}
            style={{
              padding: "7px 14px",
              borderRadius: 999,
              fontSize: 13,
              fontFamily: "var(--font-display)",
              fontWeight: 600,
              letterSpacing: 0.2,
              border: `1.5px solid ${active ? item.color : "rgba(2,56,89,0.2)"}`,
              background: active
                ? `linear-gradient(135deg, ${item.color} 0%, #26658C 120%)`
                : "rgba(255,255,255,0.82)",
              backdropFilter: "blur(10px)",
              color: active ? "#fff" : "#023859",
              boxShadow: active ? "0 6px 16px rgba(1,28,64,0.28)" : "none",
              transition: "all .15s ease",
            }}
          >
            {item.name}
          </button>
        );
      })}
    </div>
  );
}
