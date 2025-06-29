import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/GroupDetails.css';

function GroupDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [grupo, setGrupo] = useState(null);
  const [membros, setMembros] = useState([]);
  const [contas, setContas] = useState([]);
  const [erro, setErro] = useState('');

  // Busca os dados do grupo
  useEffect(() => {
    const fetchGrupo = async () => {
      try {
        const resGrupo = await fetch(`/api/groups/${id}`);
        const dataGrupo = await resGrupo.json();
        setGrupo(dataGrupo.data || {});
      } catch (err) {
        setErro('Erro ao carregar grupo.');
      }

      try {
        const resMembros = await fetch(`/api/groups/${id}/members`);
        const dataMembros = await resMembros.json();
        setMembros(dataMembros.data || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchGrupo();
  }, [id]);

  // Busca as contas do grupo
useEffect(() => {
  const fetchContas = async () => {
    try {
      const res = await fetch(`/api/groups/${id}/accounts`);
      const data = await res.json();
      console.log('📦 Contas recebidas:', data.data);
      setContas(data.data || []);
    } catch (err) {
      console.error('Erro ao buscar contas:', err);
    }
  };

  fetchContas();
}, [id]);

  if (erro) return <p>{erro}</p>;
  if (!grupo) return <p>Carregando grupo...</p>;

  return (
    <div className="group-details-container">
      <h2>{grupo.name}</h2>
      <p className="descricao"><strong>Descrição:</strong> {grupo.description || 'Sem descrição'}</p>

      <h3>Membros</h3>
      <ul className="membros-list">
        {membros.length > 0 ? (
          membros.map((membro, idx) => <li key={idx}>{membro.name}</li>)
        ) : (
          <p>Nenhum membro cadastrado.</p>
        )}
      </ul>

      <div style={{ marginTop: '20px' }}>
        <h3>💸 Contas do Grupo</h3>
        {contas.length === 0 ? (
          <p>Nenhuma conta cadastrada.</p>
        ) : (
          <ul>
            {contas.map((conta) => (
              <li key={conta.id} style={{ marginBottom: '10px' }}>
                <strong>{conta.name}</strong> — R${conta.value} — vence em {conta.due_date?.slice(0, 10)}
                <br />
                <small>Responsáveis: {conta.members || 'Ninguém'}</small>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="group-details-buttons">
        <button className="btn-edit" onClick={() => navigate(`/groups/${grupo.id}/edit`)}>
          ✏️ Editar Grupo
        </button>

        <button
          className="btn-danger"
          onClick={async () => {
            const confirmar = window.confirm('Tem certeza que deseja excluir este grupo?');
            if (!confirmar) return;

            try {
              const res = await fetch(`/api/groups/${grupo.id}`, {
                method: 'DELETE'
              });

              const data = await res.json();
              alert(data.message || 'Grupo excluído');
              if (res.ok) {
                navigate('/groups');
              }
            } catch (err) {
              alert('Erro ao excluir grupo');
              console.error(err);
            }
          }}
        >
          🗑️ Excluir Grupo
        </button>
      </div>

      <button className="back-button" onClick={() => navigate('/groups')}>
        ← Voltar para Grupos
      </button>
    </div>
  );
}

export default GroupDetails;
