import { HashLink } from "react-router-hash-link";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoClose } from "react-icons/io5";
import styles from "./MapSideMenu.module.css";
import LocalizadorImg from "@/assets/localizador_img.png";
import PetImg from "@/assets/pet_img.png";

/**
 * Propriedades do menu lateral do MapPage.
 */
export interface MapSideMenuProps {
  /**
   * Define se o menu está aberto (painel largo) ou contraído (faixa).
   */
  isOpen: boolean;

  /**
   * Callback para alternar o menu (abrir/fechar).
   */
  onToggle: () => void;

  showFooterLogo?: boolean;
}

/**
 * Menu lateral específico da página de Mapa.
 * Não substitui o Header global (Home). É um layout exclusivo do MapPage.
 *
 * Estados:
 * - Aberto: mostra logo, links e rodapé.
 * - Contraído: mostra apenas a faixa e o botão hambúrguer.
 *
 * @param {MapSideMenuProps} props
 * @returns {JSX.Element}
 */
export default function MapSideMenu({
  isOpen,
  onToggle,
  showFooterLogo = true,
}: MapSideMenuProps) {
  return (
    <aside
      className={`${styles.sideMenu} ${isOpen ? styles.open : styles.closed}`}
      aria-label="Menu lateral do mapa"
    >
      {/* Top bar (sempre visível) */}
      <div className={styles.topBar}>
        <button
          type="button"
          className={styles.iconBtn}
          onClick={onToggle}
          aria-label={isOpen ? "Fechar menu" : "Abrir menu"}
        >
          {isOpen ? <IoClose size={22} /> : <GiHamburgerMenu size={22} />}
        </button>
      </div>

      {/* Conteúdo (só quando aberto) */}
      {isOpen && (
        <div className={styles.content}>
          <div className={styles.brand}>
            <img
              src={LocalizadorImg}
              alt="Localizador de Salas"
              width={170}
              height={65}
            />
          </div>

          <nav className={styles.nav} aria-label="Navegação">
            <HashLink smooth to="/#begin" className={styles.link}>
              Início
            </HashLink>
            <HashLink smooth to="/#about" className={styles.link}>
              Sobre
            </HashLink>
            <HashLink smooth to="/#devs" className={styles.link}>
              Desenvolvedores
            </HashLink>
          </nav>

          {showFooterLogo && (
            <div className={styles.footer}>
              <div className={styles.footerPlaceholder}>
                <img
                  src={PetImg}
                  alt="Logo PET Computação"
                  width={180}
                  height={67}
                />
              </div>
            </div>
          )}
        </div>
      )}
    </aside>
  );
}
