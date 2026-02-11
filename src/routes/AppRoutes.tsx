// Arquivo responsável por centralizar TODAS as rotas da aplicação.
// Segue o padrão "Router como composição", conforme ensinado pelo Mosh.

import { BrowserRouter, Routes, Route } from "react-router-dom";

import HomePage from "@/pages/Home/HomePage";
import MapPage from "@/pages/Map/MapPage";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Página inicial */}
        <Route path="/" element={<HomePage />} />
        <Route path="/mapa" element={<MapPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
