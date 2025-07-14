import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/GroupDetails.css';

const CustomModal = ({ message, onConfirm, onCancel, type }) => {
  if (!message) return null;

  const isConfirm = type === 'confirm';

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <p>{message}</p>
        <div className="modal-actions">
          {isConfirm && (
            <button onClick={onConfirm} className="modal-btn confirm-btn">Sim</button>
          )}
          <button
            onClick={onCancel}
            className="modal-btn cancel-btn"
          >
            {isConfirm ? 'Não' : 'Fechar'}
          </button>
        </div>
      </div>
    </div>
  );
};


function App() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [grupo, setGrupo] = useState(null);
  const [membros, setMembros] = useState([]);
  const [contas, setContas] = useState([]);
  const [erro, setErro] = useState('');
  const [modal, setModal] = useState({ message: '', type: '', onConfirm: null, onCancel: null });

  const showModal = (message, type = 'alert', onConfirm = null, onCancel = () => setModal({ message: '' })) => {
    setModal({ message, type, onConfirm, onCancel });
  };

  useEffect(() => {
    const fetchGrupo = async () => {
      try {
        const resGrupo = await fetch(`/api/groups/${id}`);
        const dataGrupo = await resGrupo.json();
        setGrupo(dataGrupo.data || {});
      } catch {
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

  useEffect(() => {
    const fetchContas = async () => {
      try {
        const res = await fetch(`/api/accounts/group/${id}`); 
        const data = await res.json();
        setContas(data.data || []);
      } catch (err) {
        console.error('Erro ao buscar contas:', err);
        showModal('Erro ao buscar contas.', 'alert');
      }
    };

    fetchContas();
  }, [id]);

  function renderDivisao(divisao_manual) {
    if (!divisao_manual) return null;
    try {
      const divisao = typeof divisao_manual === 'string' ? JSON.parse(divisao_manual) : divisao_manual;

      return (
        <div className="divisao-box">
          <strong>Divisão Manual:</strong>
          <ul>
            {Object.entries(divisao).map(([nome, valor], idx) => (
              <li key={idx}>{nome}: R${parseFloat(valor).toFixed(2)}</li>
            ))}
          </ul>
        </div>
      );
    } catch (e) {
      return <p className="divisao-erro">Erro ao carregar divisão</p>;
    }
  }

  if (erro) return <p className="erro-texto">{erro}</p>;
  if (!grupo) return <p className="loading-texto">Carregando grupo...</p>;

  return (
    <div className="group-details-container">
      <CustomModal {...modal} />

      <h2 className="group-title">{grupo.name}</h2>
      <p className="group-description"><strong>Descrição:</strong> {grupo.description || 'Sem descrição'}</p>

    <h3 className="section-title">Membros</h3>
    <ul className="membros-list">
      {membros.length > 0 ? (
        membros.map((membro, idx) => <li key={idx}>{membro.name}</li>)
      ) : (
        <p className="placeholder-text">Nenhum membro cadastrado.</p>
      )}
    </ul>

    {/* ✅ Botões de ação do grupo */}
    <div className="group-buttons group-top-buttons">
      <button
        className="group-action-btn add"
        onClick={() => navigate(`/groups/${grupo.id}/accounts/new`)}
      >
        ➕ Nova Conta
      </button>

      <button
        className="group-action-btn edit"
        onClick={() => navigate(`/groups/${grupo.id}/edit`)}
      >
        ✏️ Editar Grupo
      </button>

      <button
        className="group-action-btn delete"
        onClick={() =>
          showModal(
            'Tem certeza que deseja excluir este grupo?',
            'confirm',
            async () => {
              setModal({ message: '' });
              try {
                const res = await fetch(`/api/groups/${grupo.id}`, { method: 'DELETE' });
                const data = await res.json();
                showModal(data.message || 'Grupo excluído', 'alert');
                if (res.ok) navigate('/groups');
              } catch (err) {
                showModal('Erro ao excluir grupo', 'alert');
                console.error(err);
              }
            },
            () => setModal({ message: '' })
          )
        }
      >
        🗑️ Excluir Grupo
      </button>
    </div>


      <div className="contas-section">
        <h3 className="section-title">Contas do Grupo</h3>
        {contas.length === 0 ? (
          <p className="placeholder-text">Nenhuma conta cadastrada.</p>
        ) : (
          
         <ul className="contas-list grid gap-4">
          {contas.map((conta) => {
            console.log('📃 Conta (dentro do map):', conta);
            return (
              <li
                key={conta.id}
                className="conta-item bg-white shadow-md rounded-lg p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center"
              >
                <div className="conta-info flex-grow mb-2 sm:mb-0">
                  <strong className="text-lg text-gray-800">{conta.name}</strong>
                  <div className="conta-details text-gray-600 text-sm mt-1">
                    R${parseFloat(conta.value).toFixed(2)} — vence em {conta.due_date?.slice(0, 10)}<br />
                    {renderDivisao(conta.divisao_manual)}
                  </div>
                </div>

                {/* Botões de ação todos agrupados */}
                <div className="conta-actions flex space-x-2 mt-2 sm:mt-0">
                  {/* Botão Editar Conta */}
                  <button

                    title="Editar conta"
                    onClick={() => navigate(`/accounts/${conta.id}/edit`)}
                  >
                    ✏️ Editar Conta
                  </button>

                  {/* Botão Editar Divisão */}
                  <button
  
                    title="Editar divisão"
                    onClick={() => navigate(`/accounts/${conta.id}/split`)}
                  >
                    🧮 Editar Divisão da Conta
                  </button>

                  {/* Botão Excluir Conta */}
                  <button

                    title="Excluir conta"
                    onClick={() => showModal(
                      `Deseja realmente excluir a conta "${conta.name}"?`,
                      'confirm',
                      async () => {
                        setModal({ message: '' });
                        try {
                          const res = await fetch(`/api/accounts/${conta.id}`, { method: 'DELETE' });
                          const data = await res.json();
                          showModal(data.message || 'Conta excluída', 'alert');

                          if (res.ok) {
                            setContas((prev) => prev.filter((c) => c.id !== conta.id));
                          }
                        } catch (err) {
                          showModal('Erro ao excluir conta', 'alert');
                          console.error(err);
                        }
                      },
                      () => setModal({ message: '' })
                    )}
                  >
                    🗑️ Excluir Conta
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
 

        )}
      </div>

      <button className="back-button" onClick={() => navigate('/groups')}>
        ← Voltar para Grupos
      </button>
    </div>
  );
}

export default App;
