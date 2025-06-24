const AuthContext = require('./AuthContext');
const EmailPasswordStrategy = require('./strategies/EmailPasswordStrategy');

class AuthService {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  login(email, password, callback) {
    const strategy = new EmailPasswordStrategy(this.userRepository);
    const context = new AuthContext(strategy);
    context.login(email, password, callback);
  }
}

module.exports = AuthService;
