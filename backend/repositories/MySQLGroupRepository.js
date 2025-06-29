const db = require('../config/db');
const GroupRepository = require('./GroupRepository');

class MySQLGroupRepository extends GroupRepository {
  create(group, callback) {
    const sql = 'INSERT INTO `groups` (name, description) VALUES (?, ?)';
    db.query(sql, [group.name, group.description], callback);
  }

  findAll(callback) {
    const sql = 'SELECT * FROM `groups`';
    db.query(sql, callback);
  }

  findById(id, callback) {
    const sql = 'SELECT * FROM `groups` WHERE id = ?';
    db.query(sql, [id], callback);
  }

  update(id, group, callback) {
    const sql = 'UPDATE `groups` SET name = ?, description = ? WHERE id = ?';
    db.query(sql, [group.name, group.description, id], callback);
  }

  delete(id, callback) {
    const sql = 'DELETE FROM `groups` WHERE id = ?';
    db.query(sql, [id], callback);
  }
}

module.exports = MySQLGroupRepository;
