//Swagger framework de documentação vai ser acessado por uma rota

import { Router } from "express";
const router = Router();

import swaggerUi from "swagger-ui-express"; //vai rodar as especificações como se fosse uma interface grafica sem front
import swaggerDocument from "../swagger.json" assert { type: "json" }; //aqui vai as especificações do projeto

router.use("/", swaggerUi.serve); //swaggerUi usar(serve) a rota/cria um servidor
router.get("/", swaggerUi.setup(swaggerDocument)); //pega tudo que esta no swaggerDocument e roda no swaggerUi

export default router;
