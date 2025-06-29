import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/CreateGroup.css';

function CreateAccount() {
  const navigate = useNavigate();
  const [membros, setMembros] = useState([]);
  const [name, setName] = useState('');
  const [value, setValue] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [selecionados, setSelecionados] = useState([]);
  const [msg, setMsg] = useState('');

  // Carrega os membros do grupo temporário
  useEffect(() => {
    const grupoTemp = JSON.parse(localStorage.getItem('grupoTemp'));
    if (grupoTemp?.membros) {
      setMembros(grupoTemp.membros);
    }
  }, []);

  // Envia a conta para o localStorage
  const handleSubmit = (e) => {
    e.preventDefault();

    const novaConta = {
      name,
      value: parseFloat(value),
      due_date: dueDate,
      members: selecionados
    };

    const contasTemp = JSON.parse(localStorage.getItem('contasTemp')) || [];
    contasTemp.push(novaConta);
    localStorage.setItem('contasTemp', JSON.stringify(contasTemp));

    setMsg('Conta adicionada com sucesso!');
    setTimeout(() => navigate('/groups/new'), 1000);
  };

  const toggleMembro = (nome) => {
    setSelecionados((prev) =>
      prev.includes(nome) ? prev.filter(n => n !== nome) : [...prev, nome]
    );
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

        <div style={{ marginTop: '10px' }}>
          <p><strong>Responsáveis:</strong></p>
          {membros.length === 0 ? (
            <p>Nenhum membro cadastrado.</p>
          ) : (
            membros.map((m, idx) => (
              <label key={idx} style={{ display: 'block' }}>
                <input
                  type="checkbox"
                  checked={selecionados.includes(m)}
                  onChange={() => toggleMembro(m)}
                />
                {m}
              </label>
            ))
          )}
        </div>

        <button type="submit" style={{ marginTop: '15px' }}>Salvar Conta</button>
      </form>
      <p>{msg}</p>
    </div>
  );
}

export default CreateAccount;
