console.log('📦 Arquivo group.js carregado');

const express = require('express');
const router = express.Router();

const GroupService = require('../services/GroupService');
const MySQLGroupRepository = require('../repositories/MySQLGroupRepository');
const GroupController = require('../controllers/groupController');

// Injeção de dependência
const groupRepository = new MySQLGroupRepository();
const groupService = new GroupService(groupRepository);
const groupController = new GroupController(groupService);

// Rotas
router.post('/', groupController.create);
router.get('/', groupController.getAll);
router.get('/:id', groupController.getById);
router.put('/:id', groupController.update);
router.delete('/:id', groupController.delete);
router.get('/:id/members', groupController.getMembersByGroupId);
router.get('/:id/accounts', groupController.getAccountsByGroupId);


module.exports = router;
