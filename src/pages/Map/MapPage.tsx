import { useRef, useState, useCallback, useEffect } from "react";
import L from "leaflet";
import styles from "./MapPage.module.css";
import LeafletMap from "@/components/common/LeafletMap";
import SearchBar from "@/components/common/SearchBar/SearchBar";
import MapSideMenu from "@/components/common/layout/MapSideMenu/MapSideMenu";
import RoutePanel from "@/components/common/layout/RoutePanel/RoutePanel";
import { Map } from "@/classes/Map";
import { type Coordinate_t } from "@/classes/Place.ts";
import { type Classroom_t, type ClassroomWithAccess_t, Classroom } from "@/classes/Classroom.ts";
import { Building } from "@/classes/Building";
import { IndoorGraph } from "@/classes/IndoorGraph";
import { Snackbar, type SnackbarData } from "@/components/common/Snackbar/Snackbar";

const MAP_CENTER: [number, number] = [-25.450223, -49.233239];
const MAP_ZOOM = 16;

/**
 * Página do mapa com busca de salas
 *
 * @returns {JSX.Element}
 */
export default function MapPage() {
  const mapClassRef = useRef<Map | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isRoutePanelOpen, setIsRoutePanelOpen] = useState(false);
  const [origin, setOrigin] = useState<Coordinate_t | ClassroomWithAccess_t | null>(null);
  const [userCoord, setUserCoord] = useState<Coordinate_t | null>(null);
  const [destination, setDestination] = useState<ClassroomWithAccess_t | null>(null);
  const [routeDistance, setRouteDistance] = useState<number | null>(null);
  const [routeDuration, setRouteDuration] = useState<number | null>(null);
  const [, setCurrentTime] = useState(() => Date.now());
  const [snackbar, setSnackbar] = useState<SnackbarData | null>(null);

  // re-renderiza a página a cada troca de minuto para atualizar o tempo de chegada ao destino;
  useEffect(() => {
    const updateTime = () => setCurrentTime(Date.now());

    const now = new Date();
    const msUntilNextMinute = (60 - now.getSeconds()) * 1000 - now.getMilliseconds();

    let interval: number | undefined;

    const timeout = window.setTimeout(() => {
      updateTime();
      interval = window.setInterval(updateTime, 60_000);
    }, msUntilNextMinute);

    return () => {
      window.clearTimeout(timeout);

      if (interval !== undefined) {
        window.clearInterval(interval);
      }
    };
  }, []);

  const handleMapReady = useCallback((leafletMap: L.Map) => {
    mapClassRef.current?.destroy();
    mapClassRef.current = new Map(leafletMap);
    mapClassRef.current.watchUserPosition();
  }, []);

  const MENU_WIDTH_OPEN = 300;
  const MENU_WIDTH_CLOSED = 56;
  const ROUTE_PANEL_GAP = 24;
  const ROUTE_PANEL_WIDTH = 360;

  const menuWidth = isMenuOpen ? MENU_WIDTH_OPEN : MENU_WIDTH_CLOSED;
  const leftPadding = menuWidth + ROUTE_PANEL_GAP + ROUTE_PANEL_WIDTH;

  const pageStyle = {
    "--route-panel-left": `calc(${menuWidth}px + ${ROUTE_PANEL_GAP}px)`,
  } as React.CSSProperties;

  function findDestination(termRaw: string): ClassroomWithAccess_t | null {
    const classroom = Classroom.find(termRaw);
    if (!classroom) {
      setSnackbar({
        title: "Destino não encontrado",
        message: "Verifique o nome ou código da sala e tente novamente.",
        type: "error",
      });
      return null;
    }

    mapClassRef.current?.addDestinationMarker(classroom.coordinate, classroom.name);
    setDestination(classroom);

    return classroom;
  }

  function findOrigin(termRaw: string): ClassroomWithAccess_t | null {
    const classroom = Classroom.find(termRaw);
    if (!classroom) {
      setSnackbar({
        title: "Origem não encontrada",
        message: "Verifique o nome ou código da sala e tente novamente.",
        type: "error",
      });
      return null;
    }
    mapClassRef.current?.addOriginMarker(classroom.coordinate, classroom.name);
    setOrigin(classroom);

    return classroom;
  }

  function openRoutePanel(): void {
    setIsRoutePanelOpen(true);
    //TODO: deixar o ponto de origem dinâmico se for localização do usuario
    setUserCoord((prev) => prev ?? mapClassRef.current?.userCoords ?? null);
    setOrigin((prev) => prev ?? mapClassRef.current?.userCoords ?? null);
  }

  /**
   * Pesquisa a sala e posiciona o pin.
   *
   * @param {string} termRaw Termo digitado na SearchBar.
   * @returns {void}
   */

  function handleSearch(termRaw: string | Coordinate_t): ClassroomWithAccess_t | null {
    if (typeof termRaw != "string") return null;
    const classroom = findDestination(termRaw);
    if (!classroom) return null;
    openRoutePanel();

    return classroom;
  }

  /**
   * Sugestões do topo com base nas salas do JSON.
   *
   * @param {string} query
   * @returns {SearchSuggestion[]}
   */
  function getTopSuggestions(query: string): Classroom_t[] {
    return Classroom.getSuggestions(query, 8);
  }

  function handleSidebarMeuLocal(term: string | Coordinate_t): Coordinate_t | ClassroomWithAccess_t | null {
    if (typeof term == "string") {
      return findOrigin(term);
    }

    setOrigin(term);
    return term;
  }

  useEffect(() => {
    if (!origin || !destination || !mapClassRef.current) return;
    let originEntrance: Coordinate_t | null;
    let destinationEntrance: Coordinate_t | null;

    if ("name" in origin) {
      originEntrance = Building.getNearestEntrance(origin.building_id, origin.coordinate);
      destinationEntrance = Building.getNearestEntrance(destination.building_id, origin.coordinate);
    } else {
      originEntrance = origin;
      destinationEntrance = Building.getNearestEntrance(destination.building_id, origin);
    }
    (async () => {
      if (originEntrance && destinationEntrance) {
        await mapClassRef.current?.drawRoute(originEntrance, destinationEntrance, leftPadding);
        setRouteDistance(mapClassRef.current?.routeDistance ?? null);
        setRouteDuration(mapClassRef.current?.routeDuration ?? null);
        mapClassRef.current?.removeStairsMarker();
        if (destination.floor != 0) {
          const stairs = await IndoorGraph.findNearestStair(destination.building_id, destinationEntrance);
          if (stairs) mapClassRef.current?.addStairsMarker(stairs.coordinate);
        }
      }
    })();
  }, [origin, destination, leftPadding]);

  // function toggleRoutePanel(): void {
  //   setIsRoutePanelOpen((v) => !v);
  //   window.setTimeout(() => mapClassRef.current?.invalidateSize(), 250);
  // }

  return (
    <div className={styles.pageContainer} style={pageStyle}>
      <LeafletMap className={styles.mapContainer} center={MAP_CENTER} zoom={MAP_ZOOM} onReady={handleMapReady} />

      <MapSideMenu
        isOpen={isMenuOpen}
        onToggle={() => {
          setIsMenuOpen((v) => !v);

          // Recalcula tamanho após a transição do menu
          window.setTimeout(() => {
            mapClassRef.current?.invalidateSize();
          }, 250);
        }}
      />

      {/* Painel de rota */}
      <RoutePanel
        isOpen={isRoutePanelOpen}
        routeDistance={routeDistance}
        routeDuration={routeDuration}
        origin={userCoord}
        destination={destination}
        getSuggestions={getTopSuggestions}
        onOriginSearch={handleSidebarMeuLocal}
        onDestinationSearch={findDestination}
      />

      {/* Barra de pesquisa topo (some quando o RoutePanel estiver aberto) */}
      {!isRoutePanelOpen && (
        <div className={styles.topSearchOverlay}>
          <SearchBar
            placeholder="Pesquisar (ex: PA-05)"
            onSearch={handleSearch}
            getSuggestions={getTopSuggestions}
            showRouteIcon
            onRouteClick={openRoutePanel}
            label="Selecionar ponto de destino"
          />
        </div>
      )}

      {snackbar && <Snackbar title={snackbar.title} message={snackbar.message} type={snackbar.type} onClose={() => setSnackbar(null)} />}
    </div>
  );
}
