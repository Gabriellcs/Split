const express = require('express');
const cors = require('cors');
const app = express();
const authRoutes = require('./routes/auth');

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);

app.listen(3001, () => {
  console.log('🚀 Servidor rodando na porta 3001');
});
