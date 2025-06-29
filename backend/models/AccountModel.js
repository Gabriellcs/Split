const db = require('../config/db');

class AccountModel {
  static create(account, callback) {
    const sql = 'INSERT INTO accounts (name, value, due_date, members, group_id) VALUES (?, ?, ?, ?, ?)';
    db.query(sql, [
      account.name,
      account.value,
      account.due_date,
      JSON.stringify(account.members),
      account.group_id
    ], callback);
  }

  static findByGroupId(groupId, callback) {
    const sql = 'SELECT * FROM accounts WHERE group_id = ?';
    db.query(sql, [groupId], callback);
  }

  static update(id, account, callback) {
    const sql = 'UPDATE accounts SET name = ?, value = ?, due_date = ?, members = ? WHERE id = ?';
    db.query(sql, [
      account.name,
      account.value,
      account.due_date,
      JSON.stringify(account.members),
      id
    ], callback);
  }

  static delete(id, callback) {
    const sql = 'DELETE FROM accounts WHERE id = ?';
    db.query(sql, [id], callback);
  }
}

module.exports = AccountModel;
