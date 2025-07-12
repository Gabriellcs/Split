// accountModel.js

const db = require('../config/db');

class AccountModel {
    static create(account, callback) {
        const sql = 'INSERT INTO accounts (name, value, due_date, members, group_id, divisao_manual) VALUES (?, ?, ?, ?, ?, ?)';
        db.query(sql, [
            account.name,
            account.value,
            account.due_date,
            // Certifique-se de que account.members é uma string JSON válida ou null
            account.members ? JSON.stringify(account.members) : null, 
            account.group_id,
            // Adicionando divisao_manual na criação
            account.divisao_manual ? JSON.stringify(account.divisao_manual) : null 
        ], callback);
    }

    static findByGroupId(groupId, callback) {
        // Incluindo explicitamente divisao_manual no SELECT
        const sql = 'SELECT id, name, value, due_date, group_id, members, divisao_manual FROM accounts WHERE group_id = ?';
        db.query(sql, [groupId], callback);
    }

    static update(id, account, callback) {
        // Adicionando divisao_manual na atualização
        const sql = 'UPDATE accounts SET name = ?, value = ?, due_date = ?, members = ?, divisao_manual = ? WHERE id = ?';
        db.query(sql, [
            account.name,
            account.value,
            account.due_date,
            // Certifique-se de que account.members é uma string JSON válida ou null
            account.members ? JSON.stringify(account.members) : null, 
            // Certifique-se de que account.divisao_manual é uma string JSON válida ou null
            account.divisao_manual ? JSON.stringify(account.divisao_manual) : null, 
            id
        ], callback);
    }

    static delete(id, callback) {
        const sql = 'DELETE FROM accounts WHERE id = ?';
        db.query(sql, [id], callback);
    }
}

module.exports = AccountModel;