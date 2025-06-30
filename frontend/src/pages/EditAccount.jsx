import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/CreateGroup.css';

function EditAccount() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [value, setValue] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [msg, setMsg] = useState('');

useEffect(() => {
  const fetchData = async () => {
    try {
      const res = await fetch(`/api/accounts/${id}`);
      const data = await res.json();

      const conta = data.data[0]; // pegar o primeiro objeto do array

      setName(conta.name);
      setValue(conta.value);
      setDueDate(conta.due_date?.slice(0, 10));
    } catch (err) {
      console.error('Erro ao carregar conta:', err);
      setMsg('Erro ao carregar dados da conta');
    }
  };

  fetchData();
}, [id]);



  const handleSubmit = async (e) => {
    e.preventDefault();

    const dadosAtualizados = {
      name,
      value,
      due_date: dueDate,
    };

    try {
      const res = await fetch(`/api/accounts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dadosAtualizados),
      });

      const data = await res.json();
      if (res.ok) {
        setMsg('Conta atualizada com sucesso!');
        setTimeout(() => navigate(-1), 1000);
      } else {
        setMsg(data.message || 'Erro ao atualizar conta');
      }
    } catch (err) {
      console.error('Erro ao atualizar conta:', err);
      setMsg('Erro ao atualizar conta');
    }
  };

  return (
    <div className="create-group-container">
      <h2>Editar Conta</h2>
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

        <button type="submit">Salvar Alterações</button>
      </form>
      <p>{msg}</p>
    </div>
  );
}

export default EditAccount;
