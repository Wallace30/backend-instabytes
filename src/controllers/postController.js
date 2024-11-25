import { getTodosPosts, criarPost, atualizarPost } from '../models/postModel.js';
import fs from "fs";
import gerarDescricaoComGemini from '../services/geminiService.js';
export async function listarPosts(req, res) {
    try {
        const posts = await getTodosPosts(req.app.locals.conexao);
        res.status(200).json(posts);
    } catch (erro) {
        res.status(500).json({ erro: 'Erro ao buscar posts.' });
    }
}

export async function postarNovoPost(req, res) {
    const novoPost = req.body;
    try {
        const conexao = req.app.locals.conexao;
        const postCriado = await criarPost(conexao, novoPost);
        res.status(201).json(postCriado);
    } catch (erro) {
        console.error(erro.message);
        res.status(500).json({ erro: "Falha na requisição" });
    }
}

export async function uploadImagem(req, res) {
    try {
        if (!req.file) {
            return res.status(400).json({ erro: "Nenhuma imagem foi enviada" });
        }

        const conexao = req.app.locals.conexao;
        const novoPost = {
            descricao: req.body.descricao || "",
            imgUrl: `${req.file.originalname}`,
            alt: req.body.alt || "",
        };

        const postCriado = await criarPost(conexao, novoPost);

        const imagemAtualizada = `uploads/${postCriado.insertedId}.png`;
        if (!fs.existsSync('uploads')) {
            fs.mkdirSync('uploads');
        }

        fs.renameSync(req.file.path, imagemAtualizada);

        res.status(201).json({ mensagem: "Imagem enviada e post criado com sucesso", post: postCriado });
    } catch (erro) {
        console.error(erro.message);
        res.status(500).json({ erro: "Falha no upload da imagem" });
    }
}

export async function atualizarNovoPost(req, res) {
    const id = req.params.id;

    try {
    
        const imgBuffer = fs.readFileSync(`uploads/${id}.png`)
        const descricao = await gerarDescricaoComGemini(imgBuffer)
        const post = {
            imgUrl: `http://localhost:3000/${id}.png`,
            descricao: descricao,
            alt: req.body.alt
        };
        const conexao = req.app.locals.conexao;
        const resultado = await atualizarPost(conexao, id, post);
        res.status(200).json({ mensagem: "Post atualizado com sucesso", resultado });
    } catch (erro) {
        console.error(erro.message);
        res.status(500).json({ erro: "Falha na atualização do post" });
    }
}
