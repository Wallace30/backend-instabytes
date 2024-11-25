import 'dotenv/config';
import { ObjectId } from "mongodb";

export async function getTodosPosts(conexao) {
    const db = conexao.db("imersao-instabytes");
    const colecao = db.collection("posts");
    return colecao.find().toArray();
}

export async function criarPost(conexao, novoPost) {
    const db = conexao.db("imersao-instabytes");
    const colecao = db.collection("posts");
    return colecao.insertOne(novoPost);
}

export async function atualizarPost(conexao, id, novoPost) {
    const db = conexao.db("imersao-instabytes");
    const colecao = db.collection("posts");
    const objID = new ObjectId(id);
    return colecao.updateOne({ _id: objID }, { $set: novoPost });
}
