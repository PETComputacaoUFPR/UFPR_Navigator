import styles from "./HomePage.module.css";

import Header from "@/components/common/layout/Header/Header";
import Footer from "@/components/common/layout/Footer/Footer";
import Button from "@/components/Button/Button";
import DevCard from "@/components/DevCard/DevCard";

import { developers } from "@/data/developers";
import { LiaMapMarkedAltSolid } from "react-icons/lia";
import displayImg from "@/assets/display_img.png";

function HomePage() {
  return (
    <div className={styles.container}>
      {/* ===== INÍCIO ===== */}
      <section id="begin" className={styles.begin}>
        <Header />

        <main className={styles.main}>
          <div className={styles.main_left}>
            <div className={styles.title}>
              <p>LOCALIZADOR</p>
              <p>UFPR</p>
            </div>

            <Button to="/mapa" variant="secondary">
              ACESSE O MAPA
            </Button>
          </div>

          <div className={styles.main_right_or_icon_container}>
            <LiaMapMarkedAltSolid size={600} color="white" />
          </div>
        </main>
      </section>

      {/* ===== SOBRE ===== */}
      <section id="about" className={styles.about}>
        <div className={styles.about_image}>
          <img src={displayImg} alt="Exemplo do mapa do localizador" />
        </div>

        <div className={styles.about_text}>
          <h1 className={styles.about_title}>Sobre a aplicação</h1>

          <p className={styles.about_info}>
            O UFPR Navigator é uma aplicação web desenvolvida pelo PET Computação da Universidade Federal do Paraná (UFPR) 
            com o objetivo de facilitar a orientação espacial e o deslocamento de pessoas no Campus Centro Politécnico, em Curitiba. 
            A plataforma permite localizar salas e ambientes acadêmicos de forma rápida e intuitiva, reduzindo atrasos e dificuldades
            enfrentadas por estudantes, visitantes e servidores em um campus extenso e com múltiplos blocos.
            <span className={styles.about_break} />
            Esta é a primeira versão do sistema, que se encontra em desenvolvimento contínuo. Atualmente, a aplicação integra uma 
            modelagem inicial de dados e uma interface cartográfica interativa, permitindo a busca por salas, sua visualização no mapa
            e a geração de rotas até o destino.
          </p>
        </div>
      </section>

      {/* ===== DESENVOLVEDORES ===== */}
      <section id="devs" className={styles.devs}>
        <h1 className={styles.devs_title}>Desenvolvedores</h1>

        <div className={styles.devs_team}>
          {developers.map((dev, index) => (
            <DevCard
              key={`${dev.name}-${index}`}
              name={dev.name}
              role={dev.role}
              website={dev.website}
              image={dev.image}
            />
          ))}
        </div>

        <Button to="/mapa" variant="primary">
          ACESSE O MAPA
        </Button>
      </section>

      <Footer />
    </div>
  );
}

export default HomePage;
