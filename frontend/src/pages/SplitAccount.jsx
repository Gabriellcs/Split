import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/CreateGroup.css';

function SplitAccount() {
  const { id } = useParams(); // id da conta
  const navigate = useNavigate();

  const [membros, setMembros] = useState([]);
  const [valores, setValores] = useState({});
  const [valorConta, setValorConta] = useState('');
  const [msg, setMsg] = useState('');

useEffect(() => {
  const fetchMembros = async () => {
    try {
      const res = await fetch(`/api/accounts/${id}`);
      const data = await res.json();
      console.log('Conta:', data);

      // 👇 Aqui entra o trecho que você mencionou
      const conta = Array.isArray(data.data) ? data.data[0] : data.data;
      const groupId = conta?.group_id;
      const contaValor = conta?.value || '';
      setValorConta(contaValor);

      // 🔽 Carregar valores da divisão se já existir
      if (conta?.divisao_manual) {
        try {
          const valoresSalvos = JSON.parse(conta.divisao_manual);
          setValores(valoresSalvos);
        } catch (err) {
          console.warn('⚠️ Divisão inválida no banco:', err);
        }
      }

      if (!groupId) {
        setMsg('Grupo não encontrado para esta conta.');
        return;
      }

      const resMembros = await fetch(`/api/groups/${groupId}/members`);
      const dataMembros = await resMembros.json();
      console.log('Membros do grupo:', dataMembros);

      if (!dataMembros.data || dataMembros.data.length === 0) {
        setMsg('Nenhum membro encontrado para o grupo.');
        setMembros([]);
        return;
      }

      setMembros(dataMembros.data);
    } catch (err) {
      console.error('Erro ao buscar membros:', err);
      setMsg('Erro ao carregar membros');
    }
  };

  fetchMembros();
}, [id]);


  // Inicializa valores após carregar membros
  useEffect(() => {
    if (membros.length > 0) {
      const inicial = {};
      membros.forEach(m => {
        inicial[m.name] = '';
      });
      setValores(inicial);
      setMsg('');
    }
  }, [membros]);

  const handleChange = (nome, valor) => {
    setValores((prev) => ({
      ...prev,
      [nome]: valor
    }));
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  const soma = Object.values(valores).reduce((acc, val) => acc + parseFloat(val || 0), 0);
  const valorOriginal = parseFloat(valorConta);

  if (soma.toFixed(2) !== valorOriginal.toFixed(2)) {
    setMsg(`A soma dos valores (${soma.toFixed(2)}) não bate com o valor da conta (${valorOriginal.toFixed(2)}).`);
    return;
  }

  try {
    const res = await fetch(`/api/accounts/${id}/split`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(valores)
    });

    const data = await res.json();
    setMsg(data.message || 'Divisão salva');

    if (res.ok) {
      setTimeout(() => navigate(`/groups`), 1000);
    }
  } catch (err) {
    console.error('Erro ao salvar divisão:', err);
    setMsg('Erro ao salvar');
  }
};


  return (
    <div className="create-group-container">
      <h2>Dividir Conta</h2>

      {valorConta !== '' && (
        <h3>Valor da Conta: R$ {valorConta}</h3>
      )}

      <form onSubmit={handleSubmit} className="create-group-form">
        {membros.length === 0 && <p>{msg || 'Carregando membros...'}</p>}

        {membros.map((m, idx) => (
          <div key={idx}>
            <label>{m.name}</label>
            <input
              type="number"
              value={valores[m.name] || ''}
              onChange={(e) => handleChange(m.name, e.target.value)}
              placeholder="Valor"
              required
            />
          </div>
        ))}

        {membros.length > 0 && (
          <button type="submit" style={{ marginTop: '15px' }}>Salvar Divisão</button>
        )}
      </form>

      {msg && membros.length > 0 && <p>{msg}</p>}
    </div>
  );
}

export default SplitAccount;
