const AccountRepository = require('./AccountRepository');
const AccountModel = require('../models/AccountModel');
const db = require('../config/db');


class MySQLAccountRepository extends AccountRepository {
  create(account, callback) {
    AccountModel.create(account, callback);
  }

  findByGroupId(groupId, callback) {
    AccountModel.findByGroupId(groupId, callback);
  }

  update(id, account, callback) {
    AccountModel.update(id, account, callback);
  }

  delete(id, callback) {
    AccountModel.delete(id, callback);
  }

  findById(id, callback) {
  const sql = `
    SELECT a.*, GROUP_CONCAT(m.name SEPARATOR ', ') AS members
    FROM accounts a
    LEFT JOIN account_members am ON a.id = am.account_id
    LEFT JOIN members m ON am.member_id = m.id
    WHERE a.id = ?
    GROUP BY a.id
  `;
  db.query(sql, [id], callback);
}

}

module.exports = MySQLAccountRepository;
