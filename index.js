//Este projeto utiliza a forma atual ES module 
// CommonJS module: ex /* const express = require('express'); */

import express from "express";
import connectDatabase from "./src/database/db.js";
import userRoute from "./src/routes/user.route.js";

const app = express();
const port = 3000;

connectDatabase();
app.use(express.json());
app.use("/user", userRoute);


//ROTA é a porta de entrada da nossa API, do nosso backend
//Method HTTP - É a forma como a internet se comunica - CRUD (CREATE, READ, UPDATE, DELETE)
    // GET - Pega uma info
    // POST - Cria uma info
    // PUT - Altera toda a info. Ex: Atualiza todo o obj criado.
    // PATCH - Altera parte da info. Ex: Altera só o nome do obj.
    // DELETE - Apaga uma info

//Name('/') - É um identificador da rota

//Function (Callback "função executado por trás de outra função") "(req, res)" - Responsavel por executar algum comando

//header é um metadado que é o dado dos dados. É onde configura os dados

app.listen(port, () => console.log(`Servidor rodando na porta ${port}`));