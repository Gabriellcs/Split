import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/Register.css'; // ✅ Importando o CSS

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    setMsg(data.message || 'Erro');
    if (res.status === 201) {
      setTimeout(() => navigate('/'), 1000);
    }
  };

  return (
    <div className="register-container">
      <h2>Cadastrar</h2>
      <form onSubmit={handleRegister} className="register-form">
        <input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Cadastrar</button>
      </form>
      <p>{msg}</p>
      <p>Já tem conta? <Link to="/">Entrar</Link></p>
    </div>
  );
}
