import styles from "./RoutePanel.module.css";
import SearchBar from "@/components/common/SearchBar/SearchBar";
import { FaRegCircle } from "react-icons/fa";
import { PiDotsThreeVerticalBold } from "react-icons/pi";
import { LuMapPin } from "react-icons/lu";
import { GoHomeFill } from "react-icons/go";
import { MdEditSquare } from "react-icons/md";
import { FaPersonWalking } from "react-icons/fa6";

/**
 * Propriedades do painel lateral de rotas
 */
export interface RoutePanelProps {
  /**
   * Controla visibilidade do painel.
   */
  isOpen: boolean;

  /**
   * Tempo estimado (minutos) da rota atual.
   * Quando null, deve renderizar "—"
   */
  routeMinutes: number | null;

  /**
   * Ação do campo "Meu Local"
   */
  onMeuLocalSearch: () => void;

  /**
   * Ação do campo "Local Destino"
   *
   * @param {string} term Termo digitado.
   */
  onDestinoSearch: (term: string) => void;
}

/**
 * Painel lateral de rotas.
 *
 * @param {RoutePanelProps} props
 * @returns {JSX.Element | null}
 */
export default function RoutePanel({
  isOpen,
  routeMinutes,
  onMeuLocalSearch,
  onDestinoSearch,
}: RoutePanelProps) {
  if (!isOpen) return null;

  return (
    <div className={styles.routeContainer} aria-label="Painel de rotas">
      <div className={styles.firstDivRoute}>
        <div className={styles.iconsPosition} aria-hidden>
          <FaRegCircle />
          <PiDotsThreeVerticalBold size={35} />
          <LuMapPin />
        </div>

        <div className={styles.searchRoutePosition}>
          <SearchBar
            width="100%"
            height="50px"
            background="#007EA7"
            placeholder="Meu Local"
            showRouteIcon={false}
            onSearch={() => onMeuLocalSearch()}
          />

          <SearchBar
            width="100%"
            height="50px"
            background="#007EA7"
            placeholder="Local Destino"
            showRouteIcon={false}
            onSearch={(v) => onDestinoSearch(v)}
          />
        </div>
      </div>

      <div className={styles.time}>
        <div className={styles.line}>
          <FaPersonWalking size={24} />
          <p>
            <strong>{routeMinutes !== null ? `${routeMinutes} min` : "—"}</strong>
          </p>
        </div>
      </div>

      {/* Locais Próximos (por enquanto placeholder) */}
      <div className={styles.secondDivRoute}>
        <h3>Locais Próximos</h3>
        <div className={styles.line}>
          <GoHomeFill size={24} />
          <p>Local tal</p>
        </div>
      </div>

      {/* Sugestões (por enquanto placeholder) */}
      <div className={styles.thirdDivRoute}>
        <h3>Sugestões</h3>
        <div className={styles.line}>
          <MdEditSquare size={24} />
          <p>Sugerir ponto de referência</p>
        </div>
        <div className={styles.line}>
          <MdEditSquare size={24} />
          <p>Sugerir edição de endereço</p>
        </div>
      </div>
    </div>
  );
}
