const response = require('../utils/responseHelper');
const db = require('../config/db'); 

class GroupController {
  constructor(groupService) {
    this.groupService = groupService;
  }

create = (req, res) => {
  const { name, description, membros } = req.body;
  const group = { name, description, membros };

  this.groupService.create(group, (err, result) => {
    if (err) {
      console.error('❌ ERRO ao criar grupo:', err);  
      return response.error(res, 'Erro ao criar grupo', 500);
    }

    // ✅ NOVA RESPOSTA com o ID do grupo criado
    return res.status(201).json({
      message: 'Grupo criado com sucesso',
      groupId: result.insertId
    });
  });
};


getAll = (req, res) => {
  this.groupService.getAllGroups((err, groups) => {
    if (err) {
      console.error('❌ ERRO ao buscar grupos:', err);
      return response.error(res, 'Erro ao buscar grupos');
    }
    return response.success(res, groups);
  });
};

getById = (req, res) => {
    const id = req.params.id;
    this.groupService.getGroupById(id, (err, group) => {
      if (err) return response.error(res, 'Erro ao buscar grupo');
      if (group.length === 0) return response.error(res, 'Grupo não encontrado', 404);
      return response.success(res, group[0]);
    });
};

update = (req, res) => {
  console.log('📥 Dados recebidos para atualização:', req.body); // ⬅ AQUI

  const id = req.params.id;
  const { name, description, membros } = req.body;

  const updatedGroup = { name, description, membros };

  this.groupService.updateGroup(id, updatedGroup, (err, result) => {
    if (err) return response.error(res, 'Erro ao atualizar grupo');
    return response.success(res, 'Grupo atualizado com sucesso');
  });
};

delete = (req, res) => {
    const id = req.params.id;
    this.groupService.deleteGroup(id, (err, result) => {
      if (err) return response.error(res, 'Erro ao excluir grupo');
      return response.success(res, 'Grupo excluído com sucesso');
    });
};

getMembersByGroupId(req, res) {
  const groupId = req.params.id;
  const sql = 'SELECT * FROM members WHERE group_id = ?';

  db.query(sql, [groupId], (err, results) => {
    if (err) {
      console.error('❌ ERRO ao buscar membros:', err);
      return res.status(500).json({ message: 'Erro ao buscar membros' });
    }

    res.json({ data: results });
  });
}

getAccountsByGroupId = (req, res) => {
  const groupId = req.params.id;
  console.log(`🔍 GET /${groupId}/accounts chamado`);

  const sql = `
    SELECT a.*, 
      GROUP_CONCAT(m.name SEPARATOR ', ') AS members
    FROM accounts a
    LEFT JOIN account_members am ON a.id = am.account_id
    LEFT JOIN members m ON am.member_id = m.id
    WHERE a.group_id = ?
    GROUP BY a.id
  `;

  db.query(sql, [groupId], (err, results) => {
    if (err) {
      console.error('❌ ERRO ao buscar contas:', err);
      return res.status(500).json({ message: 'Erro ao buscar contas' });
    }

    res.json({ data: results });
  });
};




}

module.exports = GroupController;
