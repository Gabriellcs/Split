import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/CreateGroup.css'; // Reaproveitando o estilo

function CreateAccount() {
  const { groupId } = useParams(); // Vindo da URL
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [value, setValue] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [msg, setMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const novaConta = {
      name,
      value: parseFloat(value),
      due_date: dueDate,
      group_id: parseInt(groupId)
    };

    try {
      const res = await fetch('/api/accounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novaConta)
      });

      const data = await res.json();
      setMsg(data.message || 'Conta adicionada com sucesso!');

      if (res.status === 201) {
        setTimeout(() => navigate(`/groups/${groupId}`), 1000);
      }
    } catch (err) {
      console.error('❌ Erro ao criar conta:', err);
      setMsg('Erro ao criar conta');
    }
  };

  return (
    <div className="create-group-container">
      <h2>Nova Conta</h2>
      <form onSubmit={handleSubmit} className="create-group-form">
        <input
          type="text"
          placeholder="Nome da conta"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Valor"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          required
        />
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />

        <button type="submit" style={{ marginTop: '15px' }}>Salvar Conta</button>
      </form>
      <p>{msg}</p>
    </div>
  );
}

export default CreateAccount;
