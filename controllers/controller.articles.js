const {selectArticles, selectArticleById, selectArticleComments} = require('../models/model.articles')


const getArticles = (req, res, next) => {
    selectArticles().then((articles) => {
        res.status(200).send({articles})
    })
}

const getArticleById  = (req, res, next) => {
    const article_id = req.params.article_id;
    selectArticleById(article_id).then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
        next(err);
    });
  };

const getArticleComments = (req, res, next) => {
  const article_id = req.params.article_id;
  Promise.all([selectArticleById(article_id), selectArticleComments(article_id)]).then((results) => {
    res.status(200).send( {comments: results[1]} );
  })
  .catch((err) => {
    next(err);
});
}

module.exports = {getArticles, getArticleById, getArticleComments}
