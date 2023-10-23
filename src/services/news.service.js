import News from "../models/News.js";

export const createService = (body) => News.create(body);

export const findAllService = (offset, limit) => News.find().sort({ _id: -1 }).skip(offset).limit(limit).populate("user"); //sort faz a ordenação, offset é para de onde eu estou pulando de 5 em 5 e o limit é quantos vai trazer. populate é para trazer os dados do user
//o que demora é a busca no banco

export const countNews = () => News.countDocuments(); //função do mongoose

export const topNewsService = () => News.findOne().sort({ _id: -1 }).populate("user");

export const findByIdService = (id) => News.findById(id).populate("user"); //vai no banco de dados fazer uma busca 

export const searchByTitleService = (title) => News.find({
    title: { $regex: `${title || ""}`, $options: "i" }, //o "i" é de case insensitive, não diferencia maiuscula de minuscula
}).sort({ _id: -1 }).populate("user");

export const byUserService = (id) => News.find({ user: id }).sort({ _id: -1 }).populate("user");

export const updateService = (id, title, text, banner) =>
    News.findOneAndUpdate({ _id: id }, { title, text, banner }, { rawResult: true });//primeiro parametro é qual item e o segundo é o que dentro do item

export const eraseService = (id) => News.findByIdAndDelete({ _id: id });

export const likeNewsService = (idNews, userId) => News.findOneAndUpdate({ _id: idNews, "likes.userId": { $nin: [userId] } }, { $push: { likes: { userId, created: new Date() } } }); //idNews foi criado aqui pq posso colocar o nome que eu quiser
//findOne analisa o array de likes, busca pelo idNews e faz alguma coisa
//push adiciona um item na array no campo likes 

export const deleteLikeNewsService = (idNews, userId) => News.findOneAndUpdate({ _id: idNews }, { $pull: { likes: { userId} } }); //pull para retirar