import styles from "./DevCard.module.css";
import DefaultImg from "@/assets/devs/default.png";

interface DevCardProps {
  name: string;
  role: string;
  website: string;
  image?: string;
}

function DevCard({ name, role, website, image }: DevCardProps) {
  return (
    <div className={styles.card}>
      <img
        src={image ?? DefaultImg}
        alt={`Foto de ${name}`}
        className={styles.avatar}
      />

      <div className={styles.info}>
        <div className={styles.text}>
          <span className={styles.name}>{name}</span>
          <span className={styles.role}>{role}</span>
        </div>

        <a
          href={website}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.link}
        >
          Página Pessoal &gt;
        </a>
      </div>
    </div>
  );
}

export default DevCard;
