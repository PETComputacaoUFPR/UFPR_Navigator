// Arquivo responsável por centralizar TODAS as rotas da aplicação.
// Segue o padrão "Router como composição", conforme ensinado pelo Mosh.

import { BrowserRouter, Routes, Route } from "react-router-dom";

import HomePage from "@/pages/Home/HomePage";

// Página de mapa ainda será criada
// Por enquanto, usamos um placeholder simples
function MapPage() {
  return <h1>Mapa</h1>;
}

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Página inicial */}
        <Route path="/" element={<HomePage />} />

        {/* Página do mapa */}
        <Route path="/mapa" element={<MapPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
