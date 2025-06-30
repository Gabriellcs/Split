class AccountService {
  constructor(accountRepository) {
    this.accountRepository = accountRepository;
  }

  createAccount(account, callback) {
    this.accountRepository.create(account, callback);
  }

  getAccountsByGroup(groupId, callback) {
    this.accountRepository.findByGroupId(groupId, callback);
  }

  updateAccount(id, account, callback) {
    this.accountRepository.update(id, account, callback);
  }

  deleteAccount(id, callback) {
    this.accountRepository.delete(id, callback);
  }

  getAccountById(id, callback) {
  this.accountRepository.findById(id, callback);
  }

}

module.exports = AccountService;
