import { createService, findAllService } from "../services/news.service.js"; 

const create = async (req, res) => {
    try {
        const { authorization } = req.headers;
        
        if (!authorization) {
            return res.send(401);
        }

        const parts = authorization.split(" ");

        if (parts.length !== 2) {
            return res.send(401);
        }

        const [schema, token] = parts;
        
        if (schema !== "Bearer") {
            return res.send(401);
        }

        const { title, text, banner } = req.body;

        if (!title || !text || !banner) {
            res.status(400).send({ message: "Submit all fields for registration" });
        }

        await createService ({
            title,
            text,
            banner,
            user: { _id: "6521986a636e97d975164f3e" },
        });

        res.send(201);
    } catch (err) {
        res.status(500).send({ message: err.message })
    }
};

const findAll = async (req, res) => {
    const news = await findAllService();
    if (news.length === 0) {
        return res.status(400).send({
            message: "There are no registered news",
        });
    }
    res.send(news);
};

export { create, findAll };