import { Link } from "react-router-dom";
import { asset } from "../../utils/asset";

export function SiteHeader() {
  return (
    <header className="site-header">
      <Link to="/" style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
        <img
          src={asset("/images/logo_doan.png")}
          alt="Huy hiệu Đoàn Thanh niên Cộng sản Hồ Chí Minh"
          className="logo-img"
        />
        <div className="titles">
          <span className="title-main">BẢN ĐỒ SỐ HOÁ ĐỊA CHỈ ĐỎ</span>
          <span className="title-sub">
            Trang Thông Tin Điện Tử Đoàn TNCS Hồ Chí Minh Xã Hưng Long – TP. Hồ Chí Minh
          </span>
        </div>
      </Link>
    </header>
  );
}
