const express = require('express');
const router= express.Router();
const db = require('./../db/models/index');
const vendedor = require('../db/models/vendedor');
const bcrypt = require('bcrypt');

router.post('/login', async (req, res) => {
    console.log(JSON.stringify(req.body));
    const { email, senha } = req.body;

    try {
        // Verificar se os dados necessários estão presentes
        if (!email || !senha) {
            return res.status(400).json({ sucesso: false, erro: 'Campos obrigatórios não fornecidos' });
        }

        // Consultar o banco de dados para encontrar o usuário pelo email
        const usuario = await db.Vendedor.findOne({
            where: { email },
            attributes: ['email', 'senha'],
        });

        // Se não encontrar o usuário, retorne um erro
        if (!usuario) {
            return res.status(404).json({ sucesso: false, erro: 'Usuário não encontrado' });
        }

        // Verificar a senha usando bcrypt
        const senhaCorreta = await bcrypt.compare(senha.trim(), usuario.senha);

        if (!senhaCorreta) {
            return res.status(401).json({ sucesso: false, erro: 'Credenciais inválidas' });
        }

        return res.json({ sucesso: true, mensagem: 'Login bem-sucedido', isAdmin: email.toLowerCase() === 'admin' });

    } catch (error) {
        console.error('Erro durante o login:', error);
        return res.status(500).json({ sucesso: false, erro: 'Erro interno durante o login' });
    }
});





router.get("/vendedrs",async(req,res) =>{
    const { page =1} = req.query;
    const vendedor = await db.Vendedor.findAll({
        attributes: ['id','nome', 'email'],
       
        order: [['id','DESC']]
    });
    if(vendedor){
        return res.json({
          vendedor 
        });
    }
    else{
        return res.status(400).json({
            mensagem: "deu ruim irmao",
        });
    }
})
router.get("/vendedrs/:id", async(req, res) =>{
    const {id} = req.params;
    const vendedor = await db.Vendedor.findOne({
        attributes: ['id', 'email', 'senha'],
        where:  {id},
    });
    if(vendedor){
        return res.json({
            vendedor: vendedor.dataValues
        });
    }else{
        return res.status(400).json({
            mensagem: "achei bosta nenhuma",});
    }
       
});

router.post("/cadasto", async (req, res) => {
    const dados = req.body;
    console.log(dados);

    // Hash da senha antes de salvar no banco de dados
    const senhaHash = await bcrypt.hash(dados.senha, 10);
    dados.senha = senhaHash;

    await db.Vendedor.create(dados).then((dadosUsuario) => {
        return res.json({
            mensagem: "usuário cadastrado com sucesso",
            dadosUsuario
        });
    }).catch(() => {
        return res.json({
            mensagem: "deu ruim irmão",
        });
    });
});
router.post("/deletar", async (req, res) => {
    const { id } = req.body;

    try {
        // Verificar se o ID do usuário foi fornecido
        if (!id) {
            return res.status(400).json({ sucesso: false, erro: 'ID do usuário não fornecido' });
        }

        // Consultar o banco de dados para encontrar o usuário pelo ID
        const usuario = await db.Vendedor.findByPk(id);

        // Se não encontrar o usuário, retorne um erro
        if (!usuario) {
            return res.status(404).json({ sucesso: false, erro: 'Usuário não encontrado' });
        }

        // Remover o usuário do banco de dados
        await usuario.destroy();

        return res.json({ sucesso: true, mensagem: 'Usuário deletado com sucesso' });
    } catch (error) {
        console.error('Erro durante a exclusão do usuário:', error);
        return res.status(500).json({ sucesso: false, erro: 'Erro interno durante a exclusão do usuário' });
    }
});
router.post("/alterar-senha", async (req, res) => {
    const { email, senhaAtual, novaSenha } = req.body;

    try {
        // Verificar se o e-mail do usuário, a senha atual e a nova senha foram fornecidos
        if (!email || !senhaAtual || !novaSenha) {
            return res.status(400).json({ sucesso: false, erro: 'E-mail do usuário, senha atual e nova senha devem ser fornecidos' });
        }

        // Consultar o banco de dados para encontrar o usuário pelo e-mail
        const usuario = await db.Vendedor.findOne({ where: { email } });

        // Se não encontrar o usuário, retorne um erro
        if (!usuario) {
            return res.status(404).json({ sucesso: false, erro: 'Usuário não encontrado' });
        }

        // Verificar a senha atual usando bcrypt
        const senhaCorreta = await bcrypt.compare(senhaAtual, usuario.senha);

        if (!senhaCorreta) {
            return res.status(401).json({ sucesso: false, erro: 'Senha atual incorreta' });
        }

        // Hash da nova senha antes de atualizar no banco de dados
        const senhaHash = await bcrypt.hash(novaSenha, 10);

        // Atualizar a senha do usuário no banco de dados
        await usuario.update({ senha: senhaHash });

        return res.json({ sucesso: true, mensagem: 'Senha alterada com sucesso' });
    } catch (error) {
        console.error('Erro durante a alteração da senha do usuário:', error);
        return res.status(500).json({ sucesso: false, erro: 'Erro interno durante a alteração da senha do usuário' });
    }
});

module.exports  = router;
