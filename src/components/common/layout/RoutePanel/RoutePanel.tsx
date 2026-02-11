import styles from "./RoutePanel.module.css";
import SearchBar from "@/components/common/SearchBar/SearchBar";
import { FaRegCircle } from "react-icons/fa";
import { PiDotsThreeVerticalBold } from "react-icons/pi";
import { LuMapPin } from "react-icons/lu";

export interface RoutePanelProps {
  /** Controla visibilidade do painel. */
  isOpen: boolean;
}

/**
 * Painel de rotas (versão simplificada).
 * Nesta etapa: apenas "Meu local" e "Local destino".
 *
 * @param {RoutePanelProps} props
 * @returns {JSX.Element | null}
 */
export default function RoutePanel({ isOpen }: RoutePanelProps) {
  if (!isOpen) return null;

  return (
    <div className={styles.routeContainer} aria-label="Painel de rotas">
      <div className={styles.firstRow}>
        <div className={styles.icons}>
          <FaRegCircle />
          <PiDotsThreeVerticalBold size={26} />
          <LuMapPin />
        </div>

        <div className={styles.inputs}>
          <SearchBar
            width="260px"
            height="46px"
            background="#007EA7"
            placeholder="Meu local"
            showRouteIcon={false}
            onSearch={() => {}}
          />

          <SearchBar
            width="260px"
            height="46px"
            background="#007EA7"
            placeholder="Local destino"
            showRouteIcon={false}
            onSearch={() => {}}
          />
        </div>
      </div>
    </div>
  );
}
