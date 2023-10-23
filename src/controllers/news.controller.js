import {
    createService,
    findAllService,
    countNews,
    topNewsService,
    findByIdService,
    searchByTitleService,
    byUserService,
    updateService,
    eraseService,
    likeNewsService,
    deleteLikeNewsService
} from "../services/news.service.js";

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

export const byUser = async (req, res) => {
    try {
        const id = req.userId; //o req.userId vem lá do authMiddleware
        const news = await byUserService(id);

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

export const update = async (req, res) => {
    try {
        const { title, text, banner } = req.body;
        const { id } = req.params;

        if (!title && !text && !banner) {
            res.status(400).send({ message: "Submit at least  one field  to update the news" });
        }

        const news = await findByIdService(id); //verifica se a news é da pessoa que criou

        /* console.log(typeof news.user._id, typeof req.userId ) verifica se o tipo das comparação do if abaixo */

        if (String(news.user._id) !== req.userId) { //verifica se o usuario é o dono da postagem
            return res.status(400).send({ message: "You didn't update this news" })
        }

        await updateService(id, title, text, banner); //lembrando que precisa ser na mesma ordem do service pois sao parametros

        return res.send({ message: "News sucessfully updated!" });
    } catch (err) {
        res.status(500).send({ message: err.message })
    }
};

export const erase = async (req, res) => {
    try {
        const { id } = req.params;

        const news = await findByIdService(id);

        if (String(news.user._id) !== req.userId) { //verifica se a news do usuario é diferente de quem esta logado
            return res.status(400).send({ message: "You didn't delete this news" })
        }

        await eraseService(id);

        return res.send({ message: "News sucessfully deleted!" })
    } catch (err) {
        res.status(500).send({ message: err.message })
    }
};

export const likeNews = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.userId; //userId vem do middleware, verifica o usuario do like

        const newsLiked = await likeNewsService(id, userId); //qual a postagem foi dado like, envia para o service o id da postagem e qual usuario

        if (!newsLiked) {
            await deleteLikeNewsService(id, userId);
            return res.status(200).send({ message: "Like successfully removed!" })
        };

        res.send({ message: "Like done successfully!" });
    } catch (err) {
        res.status(500).send({ message: err.message })
    }
};