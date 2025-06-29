const AccountRepository = require('./AccountRepository');
const AccountModel = require('../models/AccountModel');

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
}

module.exports = MySQLAccountRepository;
