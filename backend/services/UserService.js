class UserService {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  register(email, password, callback) {
    const bcrypt = require('bcryptjs');
    bcrypt.hash(password, 8, (err, hash) => {
      if (err) return callback(err);
      this.userRepository.create(email, hash, callback);
    });
  }
}

module.exports = UserService;
