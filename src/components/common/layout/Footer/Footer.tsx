import styles from "./Footer.module.css";
import LocalizadorImg from "@/assets/localizador_img.png";
import PetImg from "@/assets/pet_img.png";
import { FaInstagram } from "react-icons/fa6";
import { TbWorldWww } from "react-icons/tb";

// Links externos centralizados em constantes
const PET_SITE_URL = "https://petcomp.ufpr.br";
const PET_INSTAGRAM_URL = "https://www.instagram.com/petcompufpr";

function Footer() {
  return (
    <footer className={styles.footer}>
      {/* Logo do sistema */}
      <div>
        <img
          src={LocalizadorImg}
          alt="Logo Localizador"
          width={170}
          height={65}
        />
      </div>

      {/* Área de redes sociais e site */}
      <div className={styles.social}>
        <div className={styles.socialRow}>
          <TbWorldWww size={25}/>
          <a href={PET_SITE_URL} target="_blank">
            petcomp.ufpr.br
          </a>
        </div>

        <div className={styles.socialRow}>
          <FaInstagram size={25}/>
          <a href={PET_INSTAGRAM_URL} target="_blank">
            petcompufpr
          </a>
        </div>
      </div>

      {/* Logo institucional */}
      <div>
        <img src={PetImg} alt="Logo PET Computação" width={180} height={67} />
      </div>
    </footer>
  );
}

export default Footer;
