const db = require('../config/db');

class MemberModel {
  static create(name, groupId, callback) {
    const sql = 'INSERT INTO members (name, group_id) VALUES (?, ?)';
    db.query(sql, [name, groupId], callback);
  }

  static findByGroupId(groupId, callback) {
    const sql = 'SELECT * FROM members WHERE group_id = ?';
    db.query(sql, [groupId], callback);
  }
}

module.exports = MemberModel;
