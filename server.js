const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
const PORT = 3000;

// Middlewares
app.use(cors()); // Permite que o frontend (aberto no navegador) faça requisições para a API
app.use(express.json()); // Permite o recebimento de JSON no body da requisição

// Rota POST /users
app.post('/users', async (req, res) => {
    const { nome, email } = req.body;

    // 1. Validação de campos vazios
    if (!nome || !email) {
        return res.status(400).json({ error: 'Nome e e-mail são obrigatórios.' });
    }

    // 2. Validação do formato de e-mail (Regex simples)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Formato de e-mail inválido.' });
    }

    try {
        // 3. Inserção no banco utilizando parâmetros (?) para evitar SQL Injection
        const sql = 'INSERT INTO users (nome, email) VALUES (?, ?)';
        const [resultado] = await db.execute(sql, [nome, email]);
        
        return res.status(201).json({ message: 'Usuário cadastrado com sucesso!' });
    } catch (erro) {
        // 4. Tratamento do erro de e-mail duplicado no MySQL (código ER_DUP_ENTRY)
        if (erro.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ error: 'Este e-mail já está cadastrado.' });
        }
        
        console.error(erro);
        return res.status(500).json({ error: 'Erro interno no servidor ao cadastrar o usuário.' });
    }
});

// Inicialização do servidor
app.listen(PORT, () => {
    console.log(`Servidor backend rodando na porta ${PORT}`);
});