function success(res, message, data = null) {
  return res.status(200).json({ message, data });
}

function created(res, message, data = null) {
  return res.status(201).json({ message, data });
}

function error(res, message = 'Erro interno', code = 500) {
  return res.status(code).json({ message });
}

module.exports = { success, created, error };
