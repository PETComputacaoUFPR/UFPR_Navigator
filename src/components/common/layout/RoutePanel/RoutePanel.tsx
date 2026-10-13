import styles from "./RoutePanel.module.css";
import SearchBar from "@/components/common/SearchBar/SearchBar";
import { FaRegCircle } from "react-icons/fa";
import { PiDotsThreeVerticalBold } from "react-icons/pi";
import { LuMapPin } from "react-icons/lu";
// import { GoHomeFill } from "react-icons/go";
import { MdEditSquare } from "react-icons/md";
import { FaPersonWalking, FaClock, FaFlag } from "react-icons/fa6";
import type { Classroom_t, ClassroomWithAccess_t } from "@/classes/Classroom.ts";
import { type Coordinate_t } from "@/classes/Place.ts";
import { addSecondsToCurrentTime, secToMin } from "@/utils/timeUtils";

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
  routeDuration: number | null;
  routeDistance: number | null;
  destination: ClassroomWithAccess_t | null;
  origin: Coordinate_t | ClassroomWithAccess_t | null;

  /**
   * Função opcional para fornecer sugestões em tempo real.
   * Se definida, a SearchBar exibirá dropdown abaixo do input.
   */
  getSuggestions?: (query: string) => Classroom_t[];

  /**
   * Ação do campo "Meu Local"
   */
  onOriginSearch: (term: string | Coordinate_t) => void;

  /**
   * Ação do campo "Local Destino"
   *
   * @param {string} term Termo digitado.
   */
  onDestinationSearch: (term: string) => ClassroomWithAccess_t | null;
}

/**
 * Painel lateral de rotas.
 *
 * @param {RoutePanelProps} props
 * @returns {JSX.Element | null}
 */
export default function RoutePanel({
  isOpen,
  routeDuration,
  routeDistance,
  destination,
  origin,
  getSuggestions,
  onOriginSearch,
  onDestinationSearch,
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
            onSearch={(v) => onOriginSearch(v)}
            getSuggestions={getSuggestions}
            origin={origin}
          />

          <SearchBar
            width="100%"
            height="50px"
            background="#007EA7"
            placeholder={destination ? destination.name : "Local Destino"}
            showRouteIcon={false}
            onSearch={(v) => {
              if (typeof v == "string") onDestinationSearch(v);
            }}
            {...(getSuggestions && { getSuggestions: getSuggestions })}
          />
        </div>
      </div>

      <div className={styles.time}>
        <div className={styles.line}>
          <FaPersonWalking size={24} />
          <p>
            <strong>{routeDistance !== null ? `${Math.round(routeDistance)} m` : "—"}</strong>
          </p>
        </div>
        <div className={styles.line}>
          <FaClock size={24} />
          <p>
            <strong>{routeDuration !== null ? `${Math.round(secToMin(routeDuration))} min` : "—"}</strong>
          </p>
        </div>
        <div className={styles.line}>
          <FaFlag size={24} />
          <p>
            <strong>Chegada às {routeDuration !== null ? `${addSecondsToCurrentTime(routeDuration)}` : "—"}</strong>
          </p>
        </div>
      </div>

      {/* Locais Próximos (por enquanto placeholder) */}
      {/* <div className={styles.secondDivRoute}>
        <h3>Locais Próximos</h3>
        <div className={styles.line}>
          <GoHomeFill size={24} />
          <p>Local tal</p>
        </div>
      </div> */}

      {/* Sugestões (por enquanto placeholder) */}
      <div className={styles.thirdDivRoute}>
        <h3>Sugestões</h3>
        <div className={styles.line}>
          <MdEditSquare size={24} />
          <p>Relatar problemas</p>
        </div>
        <div className={styles.line}>
          <MdEditSquare size={24} />
          <p>Sugerir edição de endereço</p>
        </div>
      </div>
    </div>
  );
}
