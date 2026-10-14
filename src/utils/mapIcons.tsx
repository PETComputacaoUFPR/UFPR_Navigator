import L from "leaflet";
import { renderToStaticMarkup } from "react-dom/server";
import { FaStairs } from "react-icons/fa6";

export function createStairsIcon(): L.DivIcon {
  const html = renderToStaticMarkup(<FaStairs size={24} color="#007EA7" />);

  return L.divIcon({
    html,
    className: "stairs-marker",
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
}
