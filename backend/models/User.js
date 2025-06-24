const db = require('../config/db');

class UserModel {
  static create(email, passwordHash, callback) {
    const sql = 'INSERT INTO users (email, password) VALUES (?, ?)';
    db.query(sql, [email, passwordHash], (err, result) => {
      if (err) {
        console.error('❌ ERRO NO INSERT:', err);
        return callback(err);
      }
      callback(null, result);
    });
  }

  static findByEmail(email, callback) {
    const sql = 'SELECT * FROM users WHERE email = ?';
    db.query(sql, [email], (err, results) => {
      if (err) {
        console.error('❌ ERRO NO SELECT:', err);
        return callback(err);
      }
      callback(null, results);
    });
  }
}

module.exports = UserModel;
