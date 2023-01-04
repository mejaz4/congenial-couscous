const {updateVotesInArticles, selectArticles, selectArticleById, selectArticleComments, sendComment} = require('../models/model.articles')


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

const postCommentInArticle = (req, res, next) => {
  const article_id = req.params.article_id
  const body = req.body.body
  const username = req.body.username
    sendComment(article_id, username, body).then((comment) => {
      // console.log(newComment, "controller response")
      res.status(201).send({ comment });
    })
    .catch((err) => {
      next(err)
    })
}

const patchVotesInArticle = (req, res, next) => {
  const article_id = req.params.article_id
  const inc_votes = req.body.inc_votes
  Promise.all([selectArticleById(article_id), updateVotesInArticles(inc_votes, article_id)]).then((resolvedPromises) => {
    res.status(200).send( {updatedVotes: resolvedPromises[1][0]});
  })
  .catch((err) => {
    next(err)
  })
}

module.exports = { patchVotesInArticle, getArticles, getArticleById, getArticleComments, postCommentInArticle }
