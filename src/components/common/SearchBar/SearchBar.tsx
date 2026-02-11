import { useEffect, useMemo, useRef, useState } from "react";
import { IoMdSearch } from "react-icons/io";
import { LuMapPin } from "react-icons/lu";
import styles from "./SearchBar.module.css";

export type SearchSuggestion = {
  /** Identificador único da sugestão. */
  key: string;
  /** Texto exibido na lista. */
  label: string;
  /** Valor enviado ao onSearch ao clicar. */
  value: string;
};

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (value: string) => void;
  width?: string;
  height?: string;
  background?: string;

  /**
   * Função opcional para fornecer sugestões em tempo real.
   * Se definida, a SearchBar exibirá dropdown abaixo do input.
   */
  getSuggestions?: (query: string) => SearchSuggestion[];

  /**
   * Exibe o ícone de rota (ao lado da lupa).
   */
  showRouteIcon?: boolean;

  /**
   * Callback ao clicar no ícone de rota.
   */
  onRouteClick?: () => void;
}

/**
 * Barra de busca com suporte opcional a sugestões (autocomplete)
 * e botão opcional de "rota".
 *
 * @param {SearchBarProps} props
 * @returns {JSX.Element}
 */
export default function SearchBar({
  placeholder = "Pesquisar (ex: PA-05)",
  onSearch,
  width = "420px",
  height = "54px",
  background = "linear-gradient(to right, #6bbeca, #0e8ab9)",
  getSuggestions,
  showRouteIcon = false,
  onRouteClick,
}: SearchBarProps) {
  const [value, setValue] = useState("");
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  const suggestions = useMemo(() => {
    if (!getSuggestions) return [];
    return getSuggestions(value);
  }, [getSuggestions, value]);

  /**
   * Executa a pesquisa usando o valor atual.
   *
   * @returns {void}
   */
  function doSearch(): void {
    const term = value.trim();
    if (!term) return;
    onSearch?.(term);
    setOpen(false);
  }

  /**
   * Seleciona uma sugestão e pesquisa imediatamente.
   *
   * @param {SearchSuggestion} s
   * @returns {void}
   */
  function selectSuggestion(s: SearchSuggestion): void {
    setValue(s.value);
    onSearch?.(s.value);
    setOpen(false);
  }

  // Fecha dropdown ao clicar fora
  useEffect(() => {
    function onDocMouseDown(e: MouseEvent) {
      const el = rootRef.current;
      if (!el) return;
      if (!el.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDocMouseDown);
    return () => document.removeEventListener("mousedown", onDocMouseDown);
  }, []);

  return (
    <div ref={rootRef} className={styles.root} style={{ width }}>
      <div className={styles.container} style={{ height, background }} role="search">
        <input
          className={styles.input}
          type="text"
          value={value}
          placeholder={placeholder}
          onChange={(e) => {
            setValue(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => e.key === "Enter" && doSearch()}
          aria-label="Pesquisar"
        />

        <button className={styles.iconButton} onClick={doSearch} aria-label="Buscar">
          <IoMdSearch size={22} />
        </button>

        {showRouteIcon && (
          <button
            className={styles.iconButton}
            type="button"
            onClick={onRouteClick}
            aria-label="Abrir rotas"
          >
            <LuMapPin size={22} />
          </button>
        )}
      </div>

      {getSuggestions && open && suggestions.length > 0 && (
        <div className={styles.suggestions} role="listbox">
          {suggestions.map((s) => (
            <button
              key={s.key}
              type="button"
              className={styles.suggestionItem}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => selectSuggestion(s)}
              role="option"
            >
              {s.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
