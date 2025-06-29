const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

const authRoutes = require('./routes/auth');
const groupRoutes = require('./routes/group');

app.use('/api/auth', authRoutes);
app.use('/api/groups', groupRoutes);

const accountRoutes = require('./routes/account');
app.use('/api/accounts', accountRoutes);


app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
