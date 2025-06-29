module.exports = {
  success: (res, data) => res.json({ success: true, data }),
  created: (res, message = 'Criado com sucesso') => res.status(201).json({ success: true, message }),
  error: (res, message = 'Erro interno do servidor', status = 500) => res.status(status).json({ success: false, message })
};
