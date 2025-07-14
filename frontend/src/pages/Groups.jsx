import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Groups.css';

function Groups() {
  const [grupos, setGrupos] = useState([]);
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGrupos = async () => {
      try {
        const res = await fetch('/api/groups');
        const data = await res.json();
        setGrupos(data.data || []);
      } catch (err) {
        setMsg('Erro ao buscar grupos');
      }
    };

    fetchGrupos();
  }, []);

  return (
    <div className="groups-container">
      <h2>Grupos Cadastrados</h2>
      {msg && <p>{msg}</p>}

      {grupos.length === 0 ? (
        <p>Nenhum grupo cadastrado ainda.</p>
      ) : (
        <ul className="group-list">
          {grupos.map((grupo) => (
            <li key={grupo.id} className="group-item">
              <span>{grupo.name}</span>
              <Link to={`/groups/${grupo.id}`}>
                <button className="view-button">Visualizar</button>
              </Link>
            </li>
          ))}
        </ul>
      )}

      {/* ✅ Botão para voltar à tela inicial */}
      <button
        onClick={() => navigate('/Home')}
        className="back-home-groups-btn"
      >
        ← Voltar para Início
      </button>
    </div>
  );
}

export default Groups;
