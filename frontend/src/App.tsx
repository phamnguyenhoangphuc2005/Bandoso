import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { MapPage } from "./pages/MapPage";
import { LocationDetailPage } from "./pages/LocationDetailPage";

function App() {
  const basename = import.meta.env.BASE_URL.replace(/\/+$/, "") || "/";

  return (
    <BrowserRouter basename={basename}>
      <Routes>
        <Route path="/" element={<MapPage />} />
        <Route path="/location/:id" element={<LocationDetailPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
