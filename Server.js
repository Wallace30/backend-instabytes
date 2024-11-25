import 'dotenv/config'; // Carrega as variáveis do arquivo .env
import express from "express";
import conectarAoBanco from './src/config/dbConfig.js';
import postRoutes from './src/routes/postRoutes.js';

const app = express();
app.use(express.json());
app.use(express.static("uploads"))
// Porta configurada no arquivo .env ou padrão 3000
const PORT = process.env.PORT || 3000;

// Verifica se STRING_CONEXAO foi configurada no .env
if (!process.env.STRING_CONEXAO) {
  console.error("Erro: STRING_CONEXAO não está definida no arquivo .env.");
  process.exit(1); // Encerra a aplicação se a variável não for encontrada
}

async function iniciarServidor() {
    try {
        const conexao = await conectarAoBanco(process.env.STRING_CONEXAO);
        app.locals.conexao = conexao; // Armazenar a conexão no app.locals

        // Usar as rotas
        app.use('', postRoutes);

        // Inicia o servidor
        app.listen(PORT, () => {
            console.log(`Servidor escutando na porta ${PORT}...`);
        });
    } catch (erro) {
        console.error('Erro ao iniciar o servidor:', erro);
        process.exit(1);
    }
}

iniciarServidor();
