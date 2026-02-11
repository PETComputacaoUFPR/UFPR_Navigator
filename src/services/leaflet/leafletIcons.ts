import L from "leaflet";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

/**
 * Configura os ícones padrão do Leaflet para funcionar corretamente no Vite.
 * Sem isso, o marker pode aparecer como um quadrado com texto "Marker" (alt do <img>).
 *
 * @returns {void}
 */
export function configureLeafletDefaultIcons(): void {
  // O Leaflet tenta resolver URLs sozinho. No Vite, isso pode falhar.
  // Removendo este resolver interno, forçamos a usar os imports acima.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  delete (L.Icon.Default.prototype as any)._getIconUrl;

  L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
  });
}
