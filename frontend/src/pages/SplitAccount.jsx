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
  const [groupId, setGroupId] = useState(null); // 🔹 Novo estado

  useEffect(() => {
    const fetchMembros = async () => {
      try {
        const res = await fetch(`/api/accounts/${id}`);
        const data = await res.json();
        console.log('Conta:', data);

        const conta = Array.isArray(data.data) ? data.data[0] : data.data;
        const groupIdDaConta = conta?.group_id;
        const contaValor = conta?.value || '';
        setValorConta(contaValor);
        setGroupId(groupIdDaConta); // 🔹 Armazena o ID do grupo

        // 🔽 Carrega valores da divisão, se houver
        if (conta?.divisao_manual) {
          try {
            const valoresSalvos = JSON.parse(conta.divisao_manual);
            setValores(valoresSalvos);
          } catch (err) {
            console.warn('Erro, Divisão inválida no banco:', err);
          }
        }

        if (!groupIdDaConta) {
          setMsg('Erro, grupo não encontrado para esta conta.');
          return;
        }

        const resMembros = await fetch(`/api/groups/${groupIdDaConta}/members`);
        const dataMembros = await resMembros.json();
        console.log('Membros do grupo:', dataMembros);

        if (!dataMembros.data || dataMembros.data.length === 0) {
          setMsg('Erro, nenhum membro encontrado para o grupo.');
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

  useEffect(() => {
    if (membros.length > 0) {
      const inicial = {};
      membros.forEach((m) => {
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
      setMsg(`Erro, a soma dos valores (${soma.toFixed(2)}) não bate com o valor da conta (${valorOriginal.toFixed(2)}).`);
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
        setTimeout(() => navigate(`/groups/${groupId}`), 1000); // 🔹 Redireciona corretamente
      }
    } catch (err) {
      console.error('Erro ao salvar divisão:', err);
      setMsg('Erro ao salvar');
    }
  };

  return (
    <div className="create-group-container">
      <h2>Dividir Conta</h2>

      {msg && (
        <p
          className={`feedback-msg ${
            msg.toLowerCase().includes('erro') ? 'feedback-error' : 'feedback-success'
          }`}
          style={{ textAlign: 'center', fontWeight: 'bold' }}
        >
          {msg}
        </p>
      )}

      {valorConta !== '' && (
        <h3 style={{ textAlign: 'center' }}>Valor da Conta: R$ {valorConta}</h3>
      )}

      <form onSubmit={handleSubmit} className="create-group-form">
        {membros.length === 0 && <p>{msg || 'Carregando membros...'}</p>}

        {membros.map((m, idx) => (
          <div key={idx} className="membros-container">
            <label>Membro:</label><br></br>
            <label className="membro-label">{m.name}</label><br></br>
            <label>Valor:</label>
            <input
              type="number"
              min="0"
              value={valores[m.name] || ''}
              onChange={(e) => handleChange(m.name, e.target.value)}
              placeholder="Valor a ser pago por este membro"
              required
            />
          </div>
        ))}

        {membros.length > 0 && (
          <button type="submit" style={{ marginTop: '15px' }}>
            Salvar Divisão
          </button>
        )}
      </form>
    </div>
  );
}

export default SplitAccount;
