const MySQLUserRepository = require('../repositories/MySQLUserRepository');
const UserService = require('../services/UserService');
const AuthService = require('../services/AuthService');
const Response = require('../utils/responseHelper');
const { isEmpty } = require('../utils/validator');

const userRepo = new MySQLUserRepository();
const userService = new UserService(userRepo);
const authService = new AuthService(userRepo);

const register = (req, res) => {
  const { email, password } = req.body;
  userService.register(email, password, (err, result) => {
    if (err) {
      console.error('❌ ERRO NO REGISTER CONTROLLER:', err); // <----
      return res.status(500).json({ message: 'Erro ao registrar usuário', error: err });
    }
    return res.status(201).json({ message: 'Usuário criado com sucesso!' });
  });
};


const login = (req, res) => {
  const { email, password } = req.body;
  authService.login(email, password, (err, token, message) => {
    if (err) {
      console.error('❌ ERRO NO LOGIN CONTROLLER:', err); // <----
      return res.status(500).json({ message: 'Erro interno no login', error: err });
    }
    if (!token) return res.status(401).json({ message });
    return res.json({ message: 'Login bem-sucedido', data: { token } });
  });
};


module.exports = { register, login };
