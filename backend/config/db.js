const mysql = require('mysql2');

let connection = null;

function getConnection() {
  if (!connection) {
    connection = mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '2039',         // ajuste conforme seu banco
      database: 'split_db'
    });

    connection.connect((err) => {
      if (err) {
        console.error('Erro ao conectar no MySQL:', err);
        throw err;
      }
      console.log('✅ MySQL conectado via Singleton');
    });
  }

  return connection;
}

module.exports = getConnection();

