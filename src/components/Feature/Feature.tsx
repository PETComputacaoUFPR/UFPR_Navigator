import styles from "./Feature.module.css";

interface FeatureProps {
  title: string;
  icon: string;
  text: string;
  color: string;
  iconWidth: number;
  iconHeight: number;
}

function Feature({ title, icon, text, color, iconWidth, iconHeight }: FeatureProps) {
  return (
    <div key={title}>
      <div className={styles.item} style={{ backgroundColor: color }}>
        {" "}
        <img src={icon} alt={`${title}_icon`} className={styles.icon} width={iconWidth} height={iconHeight} />
      </div>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.text}>{text}</p>
    </div>
  );
}

export default Feature;
