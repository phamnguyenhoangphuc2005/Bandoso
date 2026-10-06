import type { Category } from "../../types/location";

interface Props {
  categories: Category[];
  activeId: string | null; // null = "Tất cả"
  onChange: (id: string | null) => void;
}

export function CategoryFilter({ categories, activeId, onChange }: Props) {
  const items: { id: string | null; name: string; color: string }[] = [
    { id: null, name: "Tất cả", color: "#2A2420" },
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
              fontWeight: 600,
              border: `1.5px solid ${active ? item.color : "var(--color-border)"}`,
              background: active ? item.color : "rgba(255,255,255,0.85)",
              backdropFilter: "blur(10px)",
              color: active ? "#fff" : "#2A2420",
              boxShadow: active ? "var(--shadow-card)" : "none",
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
