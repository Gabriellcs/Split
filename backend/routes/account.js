const express = require('express');
const router = express.Router();

const AccountService = require('../services/AccountService');
const MySQLAccountRepository = require('../repositories/MySQLAccountRepository');
const AccountController = require('../controllers/accountController');

// Injeção de dependência
const accountRepository = new MySQLAccountRepository();
const accountService = new AccountService(accountRepository);
const accountController = new AccountController(accountService);

// Rotas
router.post('/', accountController.create);
router.get('/group/:groupId', accountController.getByGroup);
router.put('/:id', accountController.update);
router.delete('/:id', accountController.delete);

module.exports = router;
