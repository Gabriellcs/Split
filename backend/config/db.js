const mysql = require('mysql2');

let connection = null;

function getConnection() {
  if (!connection) {
    connection = mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '2039',
      database: 'split_db'
    });

    connection.connect((err) => {
      if (err) {
        console.error('Erro ao conectar no MySQL:', err);
        throw err;
      }
      console.log('MySQL conectado');
    });
  }

  return connection;
}

module.exports = getConnection();

