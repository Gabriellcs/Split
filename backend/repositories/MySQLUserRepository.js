const db = require('../config/db');
const UserRepository = require('../interfaces/UserRepository');

class MySQLUserRepository extends UserRepository {
  create(email, passwordHash, callback) {
    const sql = 'INSERT INTO users (email, password) VALUES (?, ?)';
    db.query(sql, [email, passwordHash], callback);
  }

  findByEmail(email, callback) {
    const sql = 'SELECT * FROM users WHERE email = ?';
    db.query(sql, [email], callback);
  }
}

module.exports = MySQLUserRepository;
