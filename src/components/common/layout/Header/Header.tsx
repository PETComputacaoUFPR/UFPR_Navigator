import { HashLink } from "react-router-hash-link";
import styles from "./Header.module.css";
import LocalizadorImg from "@/assets/localizador_img.png";

function Header() {
  return (
    <header className={styles.header}>
      {/* Logo do sistema */}
      <div>
        <HashLink to="/" aria-label="Ir para a página inicial">
          <img
            src={LocalizadorImg}
            alt="Logo Localizador"
            width={170}
            height={65}
          />
        </HashLink>
      </div>

      {/* Navegação interna da Home */}
      <nav className={styles.nav}>
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
    </header>
  );
}

export default Header;
