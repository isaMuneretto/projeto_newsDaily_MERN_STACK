import News from "../models/News.js";

const createService = (body) => News.create(body);

const findAllService = (offset, limit) => News.find().sort({ _id: -1 }).skip(offset).limit(limit).populate("user"); //sort faz a ordenação, offset é para de onde eu estou pulando de 5 em 5 e o limit é quantos vai trazer. populate é para trazer os dados do user
//o que demora é a busca no banco

const countNews = () => News.countDocuments(); //função do mongoose

const topNewsService = () => News.findOne().sort({ _id: -1 }).populate("user"); 

export {
    createService,
    findAllService,
    countNews,
    topNewsService
};