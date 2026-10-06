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
        border: "1px solid rgba(2,56,89,0.18)",
        borderRadius: 999,
        padding: "10px 16px",
        boxShadow: "0 8px 24px rgba(2,56,89,0.16)",
      }}
    >
      <span aria-hidden style={{ color: "#26658C", fontSize: 15 }}>⌕</span>
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
          color: "#011C40",
          fontFamily: "var(--font-body)",
        }}
      />
      {value && (
        <button
          onClick={() => onChange("")}
          aria-label="Xoá tìm kiếm"
          style={{ border: "none", background: "none", color: "#285A78", fontSize: 14 }}
        >
          ✕
        </button>
      )}
    </div>
  );
}
