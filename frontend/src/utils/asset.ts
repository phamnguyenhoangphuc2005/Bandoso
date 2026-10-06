/**
 * Chuyển đường dẫn tài nguyên tĩnh (ảnh, video, geojson...) thành URL đúng
 * với thư mục gốc (base) của site.
 *
 *  - Local        : base = "/"          -> "/images/a.png"
 *  - GitHub Pages : base = "/Bandoso/"  -> "/Bandoso/images/a.png"
 *  - URL tuyệt đối (http, https, data:, blob:) được giữ nguyên.
 *
 * Trước đây code dùng thẳng "/images/..." nên khi lên GitHub Pages trình
 * duyệt tìm ở https://<user>.github.io/images/... và bị 404.
 */
export function asset(path: string): string {
  if (!path) return path;
  if (/^(https?:|data:|blob:|\/\/)/i.test(path)) return path;
  const base = import.meta.env.BASE_URL || "/";
  return base.replace(/\/+$/, "") + "/" + path.replace(/^\.?\/+/, "");
}
