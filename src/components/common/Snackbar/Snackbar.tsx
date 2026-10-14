import { useEffect } from "react";
import styles from "./Snackbar.module.css";

export interface SnackbarData {
  title: string;
  message: string;
  type: "error" | "success" | "info";
}

interface SnackbarProps {
  title: string;
  message: string;
  type: "error" | "success" | "info";
  onClose: () => void;
  duration?: number;
}

export function Snackbar({ title, message, type, onClose, duration = 3000 }: SnackbarProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [title, message, duration, onClose]);

  return (
    <div className={`${styles.snackbar} ${styles[type]}`} role="alert">
      <div className={styles.icon}>!</div>
      <div className={styles.content}>
        <strong>{title}</strong>
        <span>{message}</span>
      </div>
      <button className={styles.close} onClick={onClose} aria-label="Fechar">
        ×
      </button>
    </div>
  );
}
