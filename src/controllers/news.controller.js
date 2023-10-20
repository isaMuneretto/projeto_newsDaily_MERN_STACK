import { createService, findAllService, countNews, topNewsService, findByIdService, searchByTitleService } from "../services/news.service.js";

export const create = async (req, res) => {
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

        await createService({
            title,
            text,
            banner,
            user: req.userId,
        });

        res.send(201);
    } catch (err) {
        res.status(500).send({ message: err.message })
    }
};

export const findAll = async (req, res) => {
    try {
        let { limit, offset } = req.query;  //como transforma o valor não pode ser constante

        limit = Number(limit); //conversao de string para number
        offset = Number(offset);

        if (!limit) {
            limit = 5 //5 postagens por pagina aparecerão
        };

        if (!offset) {
            offset = 0 //
        };

        /* console.log(typeof limit, typeof offset); ve o tipo */

        const news = await findAllService(offset, limit);
        const total = await countNews(); //função para contar o total de postagem
        console.log(total) //mostra no terminal a quantidade
        const currentUrl = req.baseUrl //pega a url atual da requisição
        console.log(currentUrl)

        const next = offset + limit; //vai mudando conforme a paginação vai aumentando
        const nextUrl = next < total ? `${currentUrl}?limit=${limit}&offset=${next}` : null; //next é menor que total? total é a quantidade de post
        //? é o que eu vou fazer se for menor

        const previous = offset - limit < 0 ? null : offset - limit; //se offset for menor que limit retorna null
        const previousUrl = previous != null ? `${currentUrl}?limit=${limit}&offset=${previous}` : null; //se previous for diferente de null aí crio a url

        if (news.length === 0) {
            return res.status(400).send({
                message: "There are no registered news",
            });
        }
        res.send({
            nextUrl,
            previousUrl,
            limit,
            offset,
            total,

            results: news.map((item) => ({
                id: item._id,
                title: item.title,
                text: item.text,
                banner: item.banner,
                likes: item.likes,
                comments: item.comments,
                user: item.user.name,
                username: item.user.username,
                userAvatar: item.user.avatar,
            }))
        });
    } catch (err) {
        res.status(500).send({ message: err.message })
    }
};

export const topNews = async (req, res) => {
    try {
        const news = await topNewsService();

        if (!news) {
            return res.status(400).send({ message: "There is no registered post" });
        }

        res.send({
            news: {
                id: news._id,
                title: news.title,
                text: news.text,
                banner: news.banner,
                likes: news.likes,
                comments: news.comments,
                user: news.user.name,
                username: news.user.username,
                userAvatar: news.user.avatar,
            },
        });
    } catch (err) {
        res.status(500).send({ message: err.message })
    }
};

export const findById = async (req, res) => {
    try {
        const { id } = req.params;

        const news = await findByIdService(id); //como vai no banco de dados fazer uma busca precisa esperar aqui

        res.send({
            news: {
                id: news._id,
                title: news.title,
                text: news.text,
                banner: news.banner,
                likes: news.likes,
                comments: news.comments,
                user: news.user.name,
                username: news.user.username,
                userAvatar: news.user.avatar,
            },
        })
    } catch (err) {
        res.status(500).send({ message: err.message })
    }
};

export const searchByTitle = async (req, res) => {
    try {
        const { title } = req.query;

        const news = await searchByTitleService(title);//vai no banco fazer uma busca

        if (news.length === 0) {
            return res.status(400).send({ message: "There are no news with this title" });
        }
        return res.send({
            results: news.map((item) => ({
                id: item._id,
                title: item.title,
                text: item.text,
                banner: item.banner,
                likes: item.likes,
                comments: item.comments,
                user: item.user.name,
                username: item.user.username,
                userAvatar: item.user.avatar,
            })),
        });
    } catch (err) {
        res.status(500).send({ message: err.message })
    }
};