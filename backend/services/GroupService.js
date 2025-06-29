const MemberModel = require('../models/MemberModel');
const db = require('../config/db');


class GroupService {
  constructor(groupRepository) {
    this.groupRepository = groupRepository;
  }

create(group, callback) {
  console.log('📦 Iniciando criação de grupo:', group);

  this.groupRepository.create(group, (err, result) => {
    if (err) {
      console.error('❌ ERRO ao criar grupo no banco:', err);
      return callback(err);
    }

    const groupId = result.insertId;
    console.log(`✅ Grupo criado com ID: ${groupId}`);

    // Se houver membros
    if (group.membros && Array.isArray(group.membros)) {
      console.log('👥 Membros a serem salvos:', group.membros);

      const promises = group.membros.map((nome, index) => {
        console.log(`➡️ Salvando membro ${index + 1}:`, nome);

        return new Promise((resolve, reject) => {
          MemberModel.create(nome, groupId, (err, res) => {
            if (err) {
              console.error(`❌ ERRO ao salvar membro "${nome}":`, err);
              reject(err);
            } else {
              console.log(`✅ Membro "${nome}" salvo com sucesso`);
              resolve(res);
            }
          });
        });
      });

      Promise.all(promises)
        .then(() => {
          console.log('✅ Todos os membros foram salvos');

          // Verifica se há contas
          if (group.contas && Array.isArray(group.contas)) {
            console.log('💸 Contas a serem salvas:', group.contas);

            const db = require('../config/db');

            const contaPromises = group.contas.map((conta) => {
              return new Promise((resolve, reject) => {
                const contaSQL = 'INSERT INTO accounts (name, value, due_date, group_id) VALUES (?, ?, ?, ?)';
                db.query(contaSQL, [conta.name, conta.value, conta.due_date, groupId], (err, resultConta) => {
                  if (err) {
                    console.error('❌ Erro ao salvar conta:', conta.name, err);
                    return reject(err);
                  }

                  const contaId = resultConta.insertId;

                  // Relacionar membros à conta
                  if (conta.members && Array.isArray(conta.members)) {
                    const memberQuery = 'SELECT id, name FROM members WHERE group_id = ? AND name IN (?)';
                    db.query(memberQuery, [groupId, conta.members], (err, membrosEncontrados) => {
                      if (err) return reject(err);

                      const valores = membrosEncontrados.map((m) => [contaId, m.id]);
                      if (valores.length > 0) {
                        const relacaoSQL = 'INSERT INTO account_members (account_id, member_id) VALUES ?';
                        db.query(relacaoSQL, [valores], (err) => {
                          if (err) return reject(err);
                          resolve();
                        });
                      } else {
                        resolve(); // Nenhum membro associado
                      }
                    });
                  } else {
                    resolve(); // Nenhum membro para associar
                  }
                });
              });
            });

            Promise.all(contaPromises)
              .then(() => {
                console.log('✅ Contas e associações salvas');
                callback(null, result);
              })
              .catch((err) => {
                console.error('❌ Erro ao salvar contas:', err);
                callback(err);
              });

          } else {
            console.log('ℹ️ Nenhuma conta informada');
            callback(null, result);
          }
        })
        .catch(callback);

    } else {
      console.log('ℹ️ Nenhum membro informado');
      callback(null, result);
    }
  });
}


  getAll(callback) {
    this.groupRepository.findAll(callback);
  }

  getById(id, callback) {
    this.groupRepository.findById(id, callback);
  }

  updateGroup(id, group, callback) {
  console.log('🛠️ Atualizando grupo:', group); // mostra name, description e membros

  this.groupRepository.update(id, group, (err, result) => {
    if (err) {
      console.error('❌ Erro ao atualizar nome/descrição:', err);
      return callback(err);
    }

    console.log('✅ Nome/descrição atualizados com sucesso');

    if (group.membros && Array.isArray(group.membros)) {
      console.log('🧹 Limpando membros antigos do grupo', id);

      const deleteSQL = 'DELETE FROM members WHERE group_id = ?';
      db.query(deleteSQL, [id], (err) => {
        if (err) {
          console.error('❌ Erro ao deletar membros antigos:', err);
          return callback(err);
        }

        console.log('🧾 Inserindo novos membros:', group.membros);

        const promises = group.membros.map((nome) =>
          new Promise((resolve, reject) => {
            MemberModel.create(nome, id, (err, res) => {
              if (err) {
                console.error('❌ Erro ao inserir membro:', nome, err);
                reject(err);
              } else {
                console.log('✅ Membro inserido:', nome);
                resolve(res);
              }
            });
          })
        );

        Promise.all(promises)
          .then(() => {
            console.log('✅ Todos os membros atualizados com sucesso');
            callback(null, result);
          })
          .catch((err) => {
            console.error('❌ Erro geral ao inserir membros:', err);
            callback(err);
          });
      });
    } else {
      console.log('⚠️ Nenhum membro informado na atualização');
      callback(null, result);
    }
  });
}


  deleteGroup(id, callback) {
  this.groupRepository.delete(id, callback);
  }

  getAllGroups(callback) {
  this.groupRepository.findAll(callback);
  }

  getGroupById(id, callback) {
  this.groupRepository.findById(id, callback);
  }


}

module.exports = GroupService;
