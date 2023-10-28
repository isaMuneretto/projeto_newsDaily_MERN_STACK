//Swagger framework de documentação vai ser acessado por uma rota
/* ESTE ARQUIVO EM ESPECIFICO PRECISOU SER NO FORMATO DO COMMON JS PORQUE O "assert { type: "json" }" QUE EXISTIA NO ARQUIVO ANTIGO 
"SWAGGER.ROUTE.JS" O NOSSO SERVIDOR NA NUVEM RENDER NÃO CONSEGUIA LER QUANDO TENTEI FAZER O DEPLOY. 
 */
/* import { Router } from "express";
const router = Router();

import swaggerUi from "swagger-ui-express"; //vai rodar as especificações como se fosse uma interface grafica sem front
import swaggerDocument from "../swagger.json" assert { type: "json" }; //aqui vai as especificações do projeto

router.use("/", swaggerUi.serve); //swaggerUi usar(serve) a rota/cria um servidor
router.get("/", swaggerUi.setup(swaggerDocument)); //pega tudo que esta no swaggerDocument e roda no swaggerUi

export default router; */

const router = require("express").Router();

const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("../swagger.json");

router.use("/", swaggerUi.serve);
router.get("/", swaggerUi.setup(swaggerDocument));

module.exports = router;