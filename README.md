# Website Bản đồ Địa chỉ đỏ – Xã Hưng Long

Website tra cứu di tích lịch sử, địa chỉ đỏ và nhà bia tưởng niệm tại **xã Hưng Long, TP. Hồ Chí Minh** (xã mới sau sáp nhập 01/07/2025, gồm Hưng Long + Qui Đức + Đa Phước cũ), hiển thị trên bản đồ tương tác.

## Trạng thái dữ liệu hiện tại

⚠️ **Dữ liệu địa điểm (3 mục trong `locations.json`) là dữ liệu MẪU** — tên, địa chỉ, mô tả, lịch sử đều là placeholder, cần thay bằng dữ liệu thật. Ranh giới xã (`hung-long.geojson`) là **dữ liệu ranh giới hành chính thật**, lấy từ nguồn dữ liệu công khai đã cập nhật theo Nghị quyết sáp nhập 1685/NQ-UBTVQH15 (hiệu lực 01/07/2025).

Logo Đoàn TNCS Hồ Chí Minh ở Header (`public/images/logo-doan-tncs-hcm.svg`) là **bản vẽ SVG gốc do Claude tự thiết kế phỏng theo huy hiệu chính thức** (vòng ngoài vàng, nền xanh lá sọc trắng, cánh tay giương cờ đỏ sao vàng) — nếu bạn có file vector chính thức, chỉ cần thay file này (giữ nguyên tên) để dùng logo chuẩn.

## Cấu trúc dự án

```
├── backend/HungLongMap.Api/     ASP.NET Core Web API (C#), không dùng Database
│   ├── Controllers/             LocationsController, CategoriesController, MapController
│   ├── Models/                  Location.cs, Category.cs
│   ├── Services/                LocationService.cs (đọc file JSON)
│   ├── Data/                    locations.json, categories.json
│   └── wwwroot/                 images/, videos/, map/hung-long.geojson
│
└── frontend/                    React + TypeScript + Vite + Leaflet
    └── src/
        ├── components/          Map, Marker, Popup, Search, CategoryFilter
        ├── pages/                MapPage.tsx, LocationDetailPage.tsx
        ├── services/api.ts       Gọi REST API của Backend
        └── data/                 Dữ liệu mẫu dự phòng (khi chưa bật Backend)
```


## Cách chạy Backend (Visual Studio)

1. Mở `backend/HungLongMap.Api/HungLongMap.Api.csproj` bằng Visual Studio (cần .NET 8 SDK).
2. Nhấn **F5** (hoặc chọn profile `http`) để chạy. Mặc định API chạy tại `http://localhost:5000`.
3. Kiểm tra nhanh bằng Swagger tại `http://localhost:5000/swagger`.

API có sẵn:
| Method | Endpoint | Mô tả |
|---|---|---|
| GET | `/api/locations` | Toàn bộ địa điểm |
| GET | `/api/locations/{id}` | Chi tiết một địa điểm |
| GET | `/api/categories` | 3 danh mục |
| GET | `/api/map/boundary` | Ranh giới xã (GeoJSON) |

## Cách chạy Frontend

```bash
cd frontend
npm install
npm run dev
```

Mở `http://localhost:5173`. Frontend gọi Backend qua `VITE_API_BASE_URL` (mặc định `http://localhost:5000/api`, chỉnh trong file `.env` nếu cần — xem `.env.example`).

Nếu Backend chưa chạy, frontend sẽ tự động hiển thị **dữ liệu mẫu** kèm cảnh báo nhỏ trên bản đồ, để bạn vẫn xem được giao diện.

## Cách bổ sung dữ liệu thật

1. **Địa điểm mới**: thêm object vào `backend/HungLongMap.Api/Data/locations.json` (và đồng bộ sang `frontend/src/data/locations.json` nếu muốn dùng làm dữ liệu dự phòng).
2. **Ảnh / video**: bỏ file vào `backend/HungLongMap.Api/wwwroot/images/` hoặc `.../wwwroot/videos/`, rồi tham chiếu đường dẫn dạng `/images/ten-file.jpg` trong `images` của địa điểm tương ứng.
3. **Ranh giới xã**: nếu có file GeoJSON chính xác hơn, thay `wwwroot/map/hung-long.geojson` (và bản sao ở `frontend/public/map/hung-long.geojson`).

## Header / Footer

- **Header**: logo Đoàn TNCS Hồ Chí Minh + tên "BẢN ĐỒ SỐ HOÁ ĐỊA CHỈ ĐỎ" + dòng phụ "Trang Thông Tin Điện Tử Đoàn TNCS Hồ Chí Minh Xã Hưng Long – TP. Hồ Chí Minh". Component dùng chung: `frontend/src/components/Layout/SiteHeader.tsx`.
- **Footer**: `© Phạm Nguyễn Hoàng Phúc. All rights reserved.` + link Facebook thật. Component dùng chung: `frontend/src/components/Layout/SiteFooter.tsx`. Sửa hằng số `FACEBOOK_URL` trong file này nếu cần đổi link.
- Toàn bộ giao diện responsive (RWD): tự co giãn từ mobile → tablet → desktop.

## Công nghệ

- Frontend: React 19 + TypeScript + Vite + Leaflet + React Router + OpenStreetMap
- Backend: ASP.NET Core Web API (.NET 8) + C#, dữ liệu lưu bằng JSON — không dùng SQL Server/MySQL/PostgreSQL/SQLite/Firebase
