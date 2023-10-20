import News from "../models/News.js";

export const createService = (body) => News.create(body);

export const findAllService = (offset, limit) => News.find().sort({ _id: -1 }).skip(offset).limit(limit).populate("user"); //sort faz a ordenação, offset é para de onde eu estou pulando de 5 em 5 e o limit é quantos vai trazer. populate é para trazer os dados do user
//o que demora é a busca no banco

export const countNews = () => News.countDocuments(); //função do mongoose

export const topNewsService = () => News.findOne().sort({ _id: -1 }).populate("user");

export const findByIdService = (id) => News.findById(id).populate("user"); //vai no banco de dados fazer uma busca 

export const searchByTitleService = async (title) => News.find({
    title: { $regex: `${title || ""}`, $options: "i" }, //o "i" é de case insensitive, não diferencia maiuscula de minuscula
}).sort({ _id: -1 }).populate("user");