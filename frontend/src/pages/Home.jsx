import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Home.css';

function Home() {
  return (
    <div className="home-container">
      <h1>Bem-vindo ao SPLIT</h1>
      <p>Escolha uma opção:</p>

      <div className="home-buttons">
        <Link to="/groups">
          <button className="home-btn blue">Ver Grupos</button>
        </Link>

        <Link to="/groups/create">
          <button className="home-btn green">Criar Grupo</button>
        </Link>
      </div>
    </div>
  );
}

export default Home;
