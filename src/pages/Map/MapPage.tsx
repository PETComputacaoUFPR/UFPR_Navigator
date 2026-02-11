import { useCallback, useRef, useState, useMemo } from "react";
import L from "leaflet";
import styles from "./MapPage.module.css";
import LeafletMap from "../../components/common/LeafletMap";
import SearchBar, {
  type SearchSuggestion,
} from "@/components/common/SearchBar/SearchBar";
import { useSalaSearch } from "@/hooks/useClassrooms";
import MapSideMenu from "@/components/common/layout/MapSideMenu/MapSideMenu";
import RoutePanel from "@/components/common/layout/RoutePanel/RoutePanel";

/**
 * Página do mapa com busca de salas
 *
 * @returns {JSX.Element}
 */
export default function MapPage() {
  const { findSala, getSalaSuggestions } = useSalaSearch();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isRoutePanelOpen, setIsRoutePanelOpen] = useState(false);

  {/* Tempo estimado da rota atual (em minutos). Null quando não calculado. */}
  const [routeMinutes, setRouteMinutes] = useState<number | null>(null);

  const mapRef = useRef<L.Map | null>(null);
  const resultLayerRef = useRef<L.LayerGroup | null>(null);


  const MENU_WIDTH_OPEN = 300;
  const MENU_WIDTH_CLOSED = 56;
  const ROUTE_PANEL_GAP = 24;

  const routePanelLeft = useMemo(() => {
    const menuW = isMenuOpen ? MENU_WIDTH_OPEN : MENU_WIDTH_CLOSED;
    return `calc(${menuW}px + ${ROUTE_PANEL_GAP}px)`;
  }, [isMenuOpen]);

  const pageStyle = useMemo(() => {
    return { ["--route-panel-left" as any]: routePanelLeft };
  }, [routePanelLeft]);

  /**
   * Callback quando o mapa estiver pronto.
   * Cria a layer exclusiva para resultados (pin único).
   *
   * @param {L.Map} map Instância do mapa Leaflet.
   * @returns {void}
   */
  const handleMapReady = useCallback((map: L.Map) => {
    mapRef.current = map;
    resultLayerRef.current = L.layerGroup().addTo(map);
  }, []);

  /**
   * Define um único pin no mapa (limpa o anterior), centraliza e aproxima.
   *
   * @param {number} lat Latitude do destino.
   * @param {number} lng Longitude do destino.
   * @param {string} label Texto do tooltip.
   * @returns {void}
   */
  function setSinglePin(lat: number, lng: number, label: string): void {
    const map = mapRef.current;
    const layer = resultLayerRef.current;
    if (!map || !layer) return;

    layer.clearLayers();

    const marker = L.marker([lat, lng]).bindTooltip(label, {
      permanent: false,
      direction: "top",
      offset: [0, -10],
    });

    layer.addLayer(marker);
    map.setView([lat, lng], 19, { animate: true });
  }

  /**
   * Pesquisa a sala e posiciona o pin.
   *
   * @param {string} termRaw Termo digitado na SearchBar.
   * @returns {void}
   */

  function handleSearch(termRaw: string): void {
    const sala = findSala(termRaw);
    if (!sala) {
      alert("Sala não encontrada. Tente algo como: PA-05");
      return;
    }
    setSinglePin(sala.latitude, sala.longitude, sala.n_sala);
  }

  /**
   * Sugestões do topo com base nas salas do JSON.
   *
   * @param {string} q
   * @returns {SearchSuggestion[]}
   */
  function getTopSuggestions(q: string): SearchSuggestion[] {
    return getSalaSuggestions(q, 8).map((s) => ({
      key: String(s.id_sala),
      label: s.n_sala,
      value: s.n_sala,
    }));
  }

  /**
   * Nesta etapa: placeholder (implementar geolocalização).
   */
  function handleSidebarMeuLocal(): void {
    alert(
      "implementar a geolocalização para centralizar no seu local."
    );
  }

  function handleSidebarDestino(termRaw: string): void {
    const sala = findSala(termRaw);
    if (!sala) {
      alert("Sala não encontrada. Tente algo como: PA-05");
      return;
    }
    alert(
      `Destino selecionado: ${sala.n_sala}. Próximo passo: desenhar rota e tempo.`
    );
    setRouteMinutes(null);
  }

  function toggleRoutePanel(): void {
    setIsRoutePanelOpen((v) => !v);
    window.setTimeout(() => mapRef.current?.invalidateSize(), 250);
  }

  return (
    <div className={styles.pageContainer} style={pageStyle}>
      <LeafletMap
        className={styles.mapContainer}
        center={[-25.450223, -49.233239]}
        zoom={16}
        onReady={handleMapReady}
      />

      <MapSideMenu
        isOpen={isMenuOpen}
        onToggle={() => {
          setIsMenuOpen((v) => !v);

          // Recalcula tamanho após a transição do menu
          window.setTimeout(() => {
            mapRef.current?.invalidateSize();
          }, 250);
        }}
      />

      {/* Painel de rota */}
      <RoutePanel
        isOpen={isRoutePanelOpen}
        routeMinutes={routeMinutes}
        onMeuLocalSearch={handleSidebarMeuLocal}
        onDestinoSearch={handleSidebarDestino}
      />

      {/* Barra de pesquisa topo (some quando o RoutePanel estiver aberto) */}
      {!isRoutePanelOpen && (
        <div className={styles.topSearchOverlay}>
          <SearchBar
            placeholder="Pesquisar (ex: PA-05)"
            onSearch={handleSearch}
            getSuggestions={getTopSuggestions}
            showRouteIcon
            onRouteClick={toggleRoutePanel}
          />
        </div>
      )}
    </div>
  );
}
