//comunica com o banco de dados atraves da model

import User from "../models/User.js";
import jwt from "jsonwebtoken";

const loginService = (email) => User.findOne({ email: email }).select("+password"); //chaves é o filtro para buscar na model User

const generateToken = (id) => jwt.sign({ id: id }, process.env.SECRET_JWT, { expiresIn: 86400 });
/* guarda a sessão do usuario e o front-end saber qual é o usuario sem expor os dados do usuario (JWT)
os três parametros são: o dado que é recebido, a chave secreta fica no .env (criptografia MD5 "Hash") e terceiro são as options(tempo expiração do token) ) */
export { loginService, generateToken };
