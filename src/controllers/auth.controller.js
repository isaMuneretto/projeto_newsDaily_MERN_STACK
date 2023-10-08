import bcrypt from "bcrypt";
import { loginService } from "../services/auth.service.js";

const login = async (req, res) => {
    const { email, password } = req.body; //formulario a ser preenchido é o de login que recebe pelo body

    try {
        const user = await loginService(email); //busca no banco pelo email do usuario. tem que fazer pelo service por isso importa pela auth do service

        if(!user) {//validação de usuario
            res.status(404).send({ message: "User or password not found!"});
        }

        const passwordsIsValid = bcrypt.compareSync(password, user.password); //compara o password que foi enviado no body com o password do usuario. ou usa o await ou compareSync
        
        if(!passwordsIsValid) { //quando nega ! é mais facil de fazer o if
            res.status(400).send({ message: "User or password not found!"})
        }

        res.send("Login ok")
    } catch (err) {
        res.status(500).send(err.message);
    }

};

export { login };