const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const AuthStrategy = require('./AuthStrategy');

class EmailPasswordStrategy extends AuthStrategy {
  constructor(userRepository) {
    super();
    this.userRepository = userRepository;
  }

  login(email, password, callback) {
    this.userRepository.findByEmail(email, (err, results) => {
      if (err) return callback(err);
      if (results.length === 0) return callback(null, null, 'Usuário não encontrado');

      const user = results[0];
      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) return callback(err);
        if (!isMatch) return callback(null, null, 'Senha incorreta');

        const token = jwt.sign({ id: user.id }, 'segredo123', { expiresIn: '1h' });
        return callback(null, token);
      });
    });
  }
}

module.exports = EmailPasswordStrategy;
