//comunica com o banco de dados atraves da model

import User from "../models/User.js";

const loginService = (email) => User.findOne({email: email}).select("+password"); //chaves é o filtro para buscar na model User

export {loginService};
