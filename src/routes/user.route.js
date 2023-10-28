import { Router } from 'express';
const router = Router();

import userController from "../controllers/user.controller.js"
import { validId, validUser } from "../middlewares/global.middlewares.js"

router.post("/", userController.create);
router.get("/", userController.findAll);
router.get("/:id/", validId, validUser, userController.findById);
router.patch("/:id", validId, validUser, userController.update);
//PUT atualiza o objeto ou documento inteiro sobrescreve todos os dados enviados
//PATCH atualiza apenas o dado enviado.ex: só o nome ou só o email

export default router;