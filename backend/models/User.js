const db = require('../config/db');

const createUser = (email, passwordHash, callback) => {
  const sql = 'INSERT INTO users (email, password) VALUES (?, ?)';
  db.query(sql, [email, passwordHash], callback);
};

const findUserByEmail = (email, callback) => {
  const sql = 'SELECT * FROM users WHERE email = ?';
  db.query(sql, [email], callback);
};

module.exports = { createUser, findUserByEmail };
