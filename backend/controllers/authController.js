const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');


const register = (req, res) => {
  const { email, password } = req.body;
  console.log('📥 Dados recebidos para cadastro:', email, password); // <-- aqui
  bcrypt.hash(password, 8, (err, hash) => {
    if (err) return res.status(500).json({ message: 'Erro interno' });
    User.createUser(email, hash, (err, result) => {
      if (err) {
        console.error(err); // <-- log do erro real
        return res.status(500).json({ message: 'Erro ao criar usuário' });
      }
      res.status(201).json({ message: 'Usuário criado com sucesso!' });
    });
  });
};


const login = (req, res) => {
  const { email, password } = req.body;
  User.findUserByEmail(email, (err, results) => {
    if (err || results.length === 0) return res.status(401).json({ message: 'Credenciais inválidas' });
    const user = results[0];
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (!isMatch) return res.status(401).json({ message: 'Senha incorreta' });
      const token = jwt.sign({ id: user.id }, 'segredo123', { expiresIn: '1h' });
      res.json({ message: 'Login bem-sucedido', token });
    });
  });
};

module.exports = { register, login };


