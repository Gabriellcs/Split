class AuthContext {
  constructor(strategy) {
    if (typeof strategy.login !== 'function') {
      throw new Error('A estratégia deve implementar o método login()');
    }
    this.strategy = strategy;
  }

  login(email, password, callback) {
    return this.strategy.login(email, password, callback);
  }
}

module.exports = AuthContext;
