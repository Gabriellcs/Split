// accountcontroller.js

const response = require('../utils/responseHelper');
const db = require('../config/db'); // Importa a conexão com o banco UMA VEZ

class AccountController {
    constructor(accountService) {
        this.accountService = accountService;
    }

    create = (req, res) => {
        const account = req.body;

        this.accountService.createAccount(account, (err, result) => {
            if (err) return response.error(res, 'Erro ao criar conta', 500);

            // retorna o ID da nova conta
            return res.status(201).json({
                message: 'Conta criada com sucesso',
                accountId: result.insertId
            });
        });
    };

    getByGroup = (req, res) => {
        const groupId = req.params.groupId;

        this.accountService.getAccountsByGroup(groupId, (err, result) => {
            if (err) return response.error(res, 'Erro ao buscar contas', 500);
            return response.success(res, result);
        });
    };

    getById = (req, res) => {
        const id = req.params.id;

        this.accountService.getAccountById(id, (err, result) => {
            if (err) return res.status(500).json({ message: 'Erro ao buscar conta' });

            if (!result || result.length === 0) {
                return res.status(404).json({ message: 'Conta não encontrada' });
            }
            console.log('📦 Conta encontrada:', result);

            return res.status(200).json({ data: result[0] });
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
        const accountId = req.params.id;

        const sql = 'DELETE FROM accounts WHERE id = ?';
        db.query(sql, [accountId], (err, result) => {
            if (err) {
                console.error('Erro ao excluir conta:', err);
                return res.status(500).json({ message: 'Erro ao excluir conta' });
            }

            return res.status(200).json({ message: 'Conta excluída com sucesso' });
        });
    };

    updateSplit(req, res) {
        const id = req.params.id;
        const splitData = req.body;

        const sql = 'UPDATE accounts SET divisao_manual = ? WHERE id = ?';

        db.query(sql, [JSON.stringify(splitData), id], (err) => {
            if (err) {
                console.error('❌ Erro ao salvar divisão:', err);
                return res.status(500).json({ message: 'Erro ao salvar divisão' });
            }

            return res.status(200).json({ message: 'Divisão salva com sucesso' });
        });
    }
}

module.exports = AccountController;
