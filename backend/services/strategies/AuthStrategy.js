class AuthStrategy {
  login(email, password, callback) {
    throw new Error('Método login() deve ser implementado');
  }
}

module.exports = AuthStrategy;
