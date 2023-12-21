const express = require('express');
const db = require('./db/models');
const vendedor = require('./controllers/vendedors')
const app = express();
const port = 8080;
const bcrypt = require('bcrypt');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('src'));
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return res.status(400).json({ sucesso: false, erro: 'Formato de JSON inválido' });
    }
    next();
});

// Função para lidar com a lógica de cadastro

// Rota para lidar com a requisição de cadastro

// Rota para servir o formulário HTML
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/src/paginas/cadastro.html');
});

// Middleware para tratar erros no parse do corpo da requisição
app.use('/',vendedor);

// Inicia o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
