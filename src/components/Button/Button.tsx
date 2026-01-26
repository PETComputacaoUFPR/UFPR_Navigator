// Componente de botão reutilizável para navegação interna.
// Responsabilidade única: renderizar um botão estilizado e navegar
// para uma rota informada via React Router.

import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Button.module.css";

// Tipagem explícita das props do botão
interface ButtonProps {
  children: ReactNode; // Conteúdo interno do botão (texto ou ícone)
  to: string; // Rota de destino
  variant?: "primary" | "secondary"; // Variação visual do botão
}

function Button({ children, to, variant = "primary" }: ButtonProps) {
  const navigate = useNavigate();

  // Função simples para navegação
  // Mantida explícita para facilitar manutenção e debug
  const handleClick = () => {
    navigate(to);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      // Combina classe base + variação visual
      className={`${styles.button} ${styles[variant]}`}
    >
      {children}
    </button>
  );
}

export default Button;
