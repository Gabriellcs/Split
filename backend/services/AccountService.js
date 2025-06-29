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
}

module.exports = AccountService;
