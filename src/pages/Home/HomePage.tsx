import styles from "./HomePage.module.css";

import Header from "@/components/common/layout/Header/Header";
import Footer from "@/components/common/layout/Footer/Footer";
import Button from "@/components/Button/Button";
import DevCard from "@/components/DevCard/DevCard";

import { developers } from "@/data/developers";
import { LiaMapMarkedAltSolid } from "react-icons/lia";
import searchIcon from "@/assets/search_icon.png";
import routeIcon from "@/assets/route_icon.png";
import pedestrianIcon from "@/assets/pedestrian_icon.png";
import Feature from "@/components/Feature/Feature";

function HomePage() {
  const features = [
    {
      icon: searchIcon,
      title: "Busca por sala",
      text: "Encontre salas do campus pesquisando pelo nome ou código (ex.: PA-05).",
      color: "#4f1756",
      iconWidth: 72,
      iconHeight: 72,
    },
    {
      icon: routeIcon,
      title: "Rotas internas",
      text: "Visualize o caminho até a sala de destino, incluindo corredores e escadas.",
      color: "#981062",
      iconWidth: 88,
      iconHeight: 88,
    },
    {
      icon: pedestrianIcon,
      title: "Para pedestres",
      text: "Siga rotas que priorizam as calçadas do campus.",
      color: "#18abed",
      iconWidth: 72,
      iconHeight: 72,
    },
  ];

  return (
    <div className={styles.container}>
      {/* ===== INÍCIO ===== */}
      <section id="begin" className={styles.begin}>
        <Header />

        <main className={styles.main}>
          <div className={styles.main_left}>
            <div className={styles.title}>
              <p>UFPR</p>
              <p>NAVIGATOR</p>
            </div>

            <Button to="/mapa" variant="secondary">
              ENCONTRE SUA SALA
            </Button>
          </div>

          <div className={styles.main_right_or_icon_container}>
            <LiaMapMarkedAltSolid size={600} color="white" />
          </div>
        </main>
      </section>

      {/* ===== SOBRE ===== */}
      <section id="about" className={styles.about}>
        <div className={styles.about_text}>
          <h1 className={styles.about_title}>Sobre a aplicação</h1>

          <p className={styles.about_info}>
            O UFPR Navigator é uma aplicação web desenvolvida pelo PET Computação da Universidade Federal do Paraná (UFPR) para auxiliar no
            deslocamento a pé pelo Campus Centro Politécnico, em Curitiba. A plataforma permite buscar salas, vê-las em um mapa interativo e
            traçar rotas até o destino, partindo da sua localização atual ou de outro ponto escolhido. Esta é a primeira versão do sistema,
            em desenvolvimento contínuo.
          </p>
        </div>
      </section>

      <section id="features" className={styles.features}>
        {features.map((feature) => (
          <Feature
            key={feature.title}
            title={feature.title}
            icon={feature.icon}
            text={feature.text}
            color={feature.color}
            iconHeight={feature.iconHeight}
            iconWidth={feature.iconWidth}
          />
        ))}
      </section>

      {/* ===== DESENVOLVEDORES ===== */}
      <section id="devs" className={styles.devs}>
        <h1 className={styles.devs_title}>Desenvolvedores</h1>

        <div className={styles.devs_team}>
          {developers.map((dev, index) => (
            <DevCard key={`${dev.name}-${index}`} name={dev.name} role={dev.role} website={dev.website} image={dev.image} />
          ))}
        </div>

        <Button to="/mapa" variant="primary">
          ENCONTRE SUA SALA
        </Button>
      </section>

      <Footer />
    </div>
  );
}

export default HomePage;
