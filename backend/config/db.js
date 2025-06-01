const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '2039',
  database: 'split_db'
});

db.connect(err => {
  if (err) throw err;
  console.log('✅ MySQL conectado!');
});

module.exports = db;
