class UserRepository {
  create(email, passwordHash, callback) {
    throw new Error('Método create() não implementado');
  }

  findByEmail(email, callback) {
    throw new Error('Método findByEmail() não implementado');
  }
}

module.exports = UserRepository;
