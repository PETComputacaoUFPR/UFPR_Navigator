import { useEffect, useMemo, useRef, useState } from "react";
import { IoMdSearch } from "react-icons/io";
import { LuMapPin } from "react-icons/lu";
import { type Classroom_t } from "@/classes/Classroom.ts";
import { type Coordinate_t } from "@/classes/Place.ts";
import styles from "./SearchBar.module.css";

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (value: string | Coordinate_t) => void;
  width?: string;
  height?: string;
  background?: string;

  /**
   * Função opcional para fornecer sugestões em tempo real.
   * Se definida, a SearchBar exibirá dropdown abaixo do input.
   */
  getSuggestions?: (query: string) => Classroom_t[];

  /**
   * Exibe o ícone de rota (ao lado da lupa).
   */
  showRouteIcon?: boolean;

  /**
   * Callback ao clicar no ícone de rota.
   */
  onRouteClick?: () => void;

  origin?: Classroom_t | Coordinate_t | null;
}

/**
 * Barra de busca com suporte opcional a sugestões (autocomplete)
 * e botão de rota.
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
  origin,
}: SearchBarProps) {
  const offset = origin ? 1 : 0;
  const [value, setValue] = useState("");
  const [open, setOpen] = useState(false);
  // Indice selecionado na lista de sugestoes
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const rootRef = useRef<HTMLDivElement | null>(null);

  const suggestions = useMemo(() => {
    if (!getSuggestions) return [];
    return getSuggestions(value);
  }, [getSuggestions, value]);

  // Reinicia o indice selecionado na lista de sugestoes, não é bom usar useEffect  e useState combinado
  const [prevSuggestions, setPrevSuggestions] = useState(suggestions);
  if (suggestions !== prevSuggestions) {
    setPrevSuggestions(suggestions);
    setSelectedIndex(-1);
  }

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
   * @param {Classroom_t} s
   * @returns {void}
   */
  function selectSuggestion(suggestion: Classroom_t | Coordinate_t): void {
    if ("name" in suggestion) {
      setValue(suggestion.name);
      onSearch?.(suggestion.name);
    } else {
      setValue("Meu Local");
      onSearch?.(suggestion);
    }
    setOpen(false);
  }

  /**
   * Controla a navegação por teclado da lista de sugestões.
   *
   * - Enter: seleciona a sugestão selecionada ou o valor do input, e executa a busca
   * - ArrowDown: avança uma posição na lista de sugestões
   * - ArrowUp: retorna uma posição na lista de sugestões
   * @param {React.KeyboardEvent<HTMLInputElement>} e
   * @returns {void}
   */
  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>): void {
    const totalSuggestions = suggestions.length + offset;
    if (e.key == "Enter") {
      if (selectedIndex != -1) {
        if (origin && selectedIndex == 0) {
          selectSuggestion(origin);
        } else {
          selectSuggestion(suggestions[selectedIndex - offset]);
        }
      } else {
        doSearch();
      }
      return;
    }

    if (suggestions.length == 0) return;

    //  Como depende do estado anterior, utiliza o prev para garantir mais seguranca
    if (e.key == "ArrowDown") {
      setSelectedIndex((prev) => (prev + 1) % totalSuggestions);
    }

    if (e.key == "ArrowUp") {
      setSelectedIndex((prev) => {
        // previne que vá para o antepenúltimo elemento da lista quando selectedIndex é inicializado
        const decrement = prev != -1 ? 1 : 0;
        return (prev + totalSuggestions - decrement) % totalSuggestions;
      });
    }
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
          onKeyDown={handleKeyDown}
          aria-label="Pesquisar"
        />

        <button className={styles.iconButton} onClick={doSearch} aria-label="Buscar">
          <IoMdSearch size={22} />
        </button>

        {showRouteIcon && (
          <button className={styles.iconButton} type="button" onClick={onRouteClick} aria-label="Abrir rotas">
            <LuMapPin size={22} />
          </button>
        )}
      </div>

      {getSuggestions && open && (suggestions.length > 0 || origin) && (
        <div className={styles.suggestions} role="listbox">
          {origin && (
            <button
              key={0}
              type="button"
              // Destaca a sugestao selecionada pelo mouse ou teclado
              className={`${styles.suggestionItem} ${selectedIndex == 0 ? styles.active : ""}`}
              onMouseDown={(e) => e.preventDefault()}
              // Eventos para sincronizar mouse/teclado (substitui hover)
              onMouseEnter={() => setSelectedIndex(0)}
              onMouseLeave={() => setSelectedIndex(-1)}
              onClick={() => selectSuggestion(origin)}
              role="option"
            >
              Meu Local
            </button>
          )}
          {suggestions.map((suggestion, index) => (
            <button
              key={suggestion.id}
              type="button"
              // Destaca a sugestao selecionada pelo mouse ou teclado
              className={`${styles.suggestionItem} ${selectedIndex == index + offset ? styles.active : ""}`}
              onMouseDown={(e) => e.preventDefault()}
              // Eventos para sincronizar mouse/teclado (substitui hover)
              onMouseEnter={() => setSelectedIndex(index + offset)}
              onMouseLeave={() => setSelectedIndex(-1)}
              onClick={() => selectSuggestion(suggestion)}
              role="option"
            >
              {suggestion.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
