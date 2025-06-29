const response = require('../utils/responseHelper');

class AccountController {
  constructor(accountService) {
    this.accountService = accountService;
  }

  create = (req, res) => {
    const account = req.body;

    this.accountService.createAccount(account, (err, result) => {
      if (err) return response.error(res, 'Erro ao criar conta', 500);
      return response.created(res, 'Conta criada com sucesso');
    });
  };

  getByGroup = (req, res) => {
    const groupId = req.params.groupId;

    this.accountService.getAccountsByGroup(groupId, (err, result) => {
      if (err) return response.error(res, 'Erro ao buscar contas', 500);
      return response.success(res, result);
    });
  };

  update = (req, res) => {
    const id = req.params.id;
    const account = req.body;

    this.accountService.updateAccount(id, account, (err) => {
      if (err) return response.error(res, 'Erro ao atualizar conta', 500);
      return response.success(res, 'Conta atualizada com sucesso');
    });
  };

  delete = (req, res) => {
    const id = req.params.id;

    this.accountService.deleteAccount(id, (err) => {
      if (err) return response.error(res, 'Erro ao excluir conta', 500);
      return response.success(res, 'Conta excluída com sucesso');
    });
  };
}

module.exports = AccountController;
