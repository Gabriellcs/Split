import React, { useState } from 'react';
import './MembrosInput.css';

export default function MembrosInput({ membros, setMembros }) {
  const [input, setInput] = useState('');

  const adicionarMembro = () => {
    const nome = input.trim();
    if (nome && !membros.includes(nome)) {
      setMembros([...membros, nome]);
      setInput('');
    }
  };

  const removerMembro = (index) => {
    const atualizados = [...membros];
    atualizados.splice(index, 1);
    setMembros(atualizados);
  };

  return (
    <div className="membros-container">
      <label>Integrantes:</label>
      <div className="chips">
        {membros.map((membro, idx) => (
          <span className="chip" key={idx}>
            {membro}
            <button type="button" onClick={() => removerMembro(idx)}>×</button>
          </span>
        ))}
      </div>
      <input
        type="text"
        value={input}
        placeholder="Digite o nome e pressione Enter"
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && adicionarMembro()}
      />
      <button type="button" onClick={adicionarMembro}>Adicionar</button>
    </div>
  );
}
