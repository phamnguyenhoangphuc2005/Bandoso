import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MapPage } from "./pages/MapPage";
import { LocationDetailPage } from "./pages/LocationDetailPage";

function App() {
  return (
    <BrowserRouter basename="/Bandoso">
      <Routes>
        <Route path="/" element={<MapPage />} />
        <Route path="/location/:id" element={<LocationDetailPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;