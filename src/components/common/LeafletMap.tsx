import { useEffect, useRef } from "react";
import L from "leaflet";

type LatLngTuple = [number, number];

interface LeafletMapProps {
  /** Centro inicial do mapa. */
  center: LatLngTuple;
  /** Zoom inicial do mapa. */
  zoom: number;
  /** Classe CSS aplicada ao container do mapa. */
  className?: string;
  /**
   * Callback chamado quando o mapa estiver pronto.
   * Use para criar layers, markers e controles fora do componente.
   */
  onReady?: (map: L.Map) => void;
}

/**
 * Renderiza um mapa Leaflet e gerencia ciclo de vida (init + destroy).
 * Importante: o mapa é inicializado apenas uma vez.
 *
 * @param {LeafletMapProps} props
 * @returns {JSX.Element}
 */
export default function LeafletMap({ center, zoom, className, onReady }: LeafletMapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const onReadyRef = useRef<LeafletMapProps["onReady"]>(onReady);

  // Mantém a referência mais recente do callback, sem reinit do mapa.
  useEffect(() => {
    onReadyRef.current = onReady;
  }, [onReady]);

  // Inicializa o mapa apenas uma vez.
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, { zoomControl: true }).setView(center, zoom);

    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    mapRef.current = map;
    onReadyRef.current?.(map);

    return () => {
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // <- CRÍTICO: NÃO dependa de center/zoom por referência

  return <div ref={containerRef} className={className} />;
}
