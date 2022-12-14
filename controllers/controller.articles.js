const {selectArticles} = require('../models/model.articles')


const getArticles = (req, res, next) => {
    selectArticles().then((articles) => {
        res.status(200).send({articles})
    })
}

const getArticleById = (req, res, next) => {
    selectArticleById().then((articles) => {
        res.status(200).send({articles})
    })
}

module.exports = {getArticles, getArticleById}
