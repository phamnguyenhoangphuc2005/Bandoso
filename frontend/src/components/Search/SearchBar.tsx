interface Props {
  value: string;
  onChange: (value: string) => void;
}

export function SearchBar({ value, onChange }: Props) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        background: "rgba(255,255,255,0.85)",
        backdropFilter: "blur(10px)",
        border: "1px solid var(--color-border)",
        borderRadius: 999,
        padding: "10px 16px",
        boxShadow: "var(--shadow-card)",
      }}
    >
      <span aria-hidden style={{ color: "#B8202A", fontSize: 15 }}>⌕</span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Tìm địa điểm theo tên..."
        aria-label="Tìm địa điểm theo tên"
        style={{
          border: "none",
          outline: "none",
          fontSize: 14,
          flex: 1,
          background: "transparent",
          color: "#2A2420",
        }}
      />
      {value && (
        <button
          onClick={() => onChange("")}
          aria-label="Xoá tìm kiếm"
          style={{ border: "none", background: "none", color: "#6B5F4F", fontSize: 14 }}
        >
          ✕
        </button>
      )}
    </div>
  );
}
