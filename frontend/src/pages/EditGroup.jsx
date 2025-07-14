import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MembrosInput from '../components/MembrosInput';
import '../styles/CreateGroup.css'; // reutiliza o estilo do formulário de criação

function EditGroup() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [membros, setMembros] = useState([]);
  const [msg, setMsg] = useState('');

  // Carrega os dados do grupo ao entrar
  useEffect(() => {
    const fetchData = async () => {
      try {
        const resGrupo = await fetch(`/api/groups/${id}`);
        const resMembros = await fetch(`/api/groups/${id}/members`);

        const dataGrupo = await resGrupo.json();
        const dataMembros = await resMembros.json();

        setName(dataGrupo.data.name);
        setDescription(dataGrupo.data.description);
        setMembros(dataMembros.data.map(m => m.name)); // converte para array de nomes

      } catch (err) {
        console.error('Erro ao carregar grupo:', err);
        setMsg('Erro ao carregar grupo');
      }
    };

    fetchData();
  }, [id]);

const handleSubmit = async (e) => {
  e.preventDefault();

  const dadosAtualizados = {
    name,
    description,
    membros: membros.filter(m => m.trim() !== '')
  };

  try {
    console.log('🔁 Enviando atualização:', dadosAtualizados);

    const res = await fetch(`/api/groups/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dadosAtualizados)
    });

    const data = await res.json().catch(() => ({})); // evita erro de JSON inválido

    if (res.ok) {
      setMsg(data.message || 'Grupo atualizado com sucesso');
      setTimeout(() => navigate(`/groups/${id}`), 1000);
    } else {
      setMsg(data.message || 'Erro ao atualizar');
    }

  } catch (err) {
    console.error('Erro ao atualizar grupo:', err);
    setMsg('Erro ao atualizar grupo');
  }
};


  return (
    <div className="create-group-container">
      <h2>Editar Grupo</h2>
      <form onSubmit={handleSubmit} className="create-group-form">
        <input
          type="text"
          placeholder="Nome do grupo"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <textarea
          placeholder="Descrição"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <MembrosInput membros={membros} setMembros={setMembros} />

        <button type="submit">Salvar Alterações</button>
      </form>
      
      {msg && (
        <p className={`feedback-msg ${msg.toLowerCase().includes('erro') ? 'feedback-error' : 'feedback-success'}`}>
          {msg}
        </p>
      )}


    </div>
  );
}

export default EditGroup;
