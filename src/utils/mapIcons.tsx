import L from "leaflet";
import { renderToStaticMarkup } from "react-dom/server";
import { FaStairs } from "react-icons/fa6";

export function createStairsIcon(): L.DivIcon {
  const html = renderToStaticMarkup(
    <div
      style={{
        width: 32,
        height: 32,
        borderRadius: "50%",
        background: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 1px 4px rgba(0, 0, 0, 0.45)",
      }}
    >
      <FaStairs size={18} color="#007EA7" />
    </div>,
  );

  return L.divIcon({
    html,
    className: "stairs-marker",
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
}
