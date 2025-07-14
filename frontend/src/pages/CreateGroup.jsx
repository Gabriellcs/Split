import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/CreateGroup.css';
import MembrosInput from '../components/MembrosInput';

function CreateGroup() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [membros, setMembros] = useState([]);
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const grupo = {
      name,
      description,
      membros: membros.filter(m => m.trim() !== '')
    };

    try {
      const res = await fetch('/api/groups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(grupo),
      });

      const data = await res.json();

      if (res.status === 201 && data.groupId) {
        setMsg(data.message || 'Grupo criado com sucesso');
        // Redireciona para criação de conta usando o ID retornado
        setTimeout(() => navigate(`/groups/${data.groupId}/accounts/new`), 1000);
      } else {
        setMsg(data.message || 'Erro ao criar grupo');
      }
    } catch (err) {
      console.error('Erro ao criar grupo:', err);
      setMsg('Erro ao criar grupo');
    }
  };

  return (
    <div className="create-group-container">
      <h2>Criar Novo Grupo</h2>
      <form onSubmit={handleSubmit} className="create-group-form">
        <div className="membros-container">
          <label>Nome do grupo:</label>
          <input
            type="text"
            placeholder="Ex: Contas da casa, Viagem com amigos..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <label>Descrição (opcional):</label>
          <textarea
            placeholder="Descreva brevemente o objetivo do grupo"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <MembrosInput membros={membros} setMembros={setMembros} />

        <button type="submit">Criar Conta</button>
      </form>
      
      {msg && (
        <p className={`feedback-msg ${msg.toLowerCase().includes('erro') ? 'feedback-error' : 'feedback-success'}`}>
          {msg}
        </p>
      )}


      <button
        onClick={() => navigate('/Home')}
        className="home-create-btn"
      >
        ← Voltar para Início
      </button>

    </div>
  );
}

export default CreateGroup;
