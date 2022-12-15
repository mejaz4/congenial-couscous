const express = require('express');
const {getTopics} = require('./controllers/controller.topics')
const {getArticles, getArticleById, getArticleComments, postCommentInArticle} = require('./controllers/controller.articles')

const app = express();


const {handle404Paths, handle400, handleCustomerErrors, handle500s} = require('./error.controller')


app.get('/api/topics', getTopics);
app.get('/api/articles', getArticles);
app.get('/api/articles/:article_id', getArticleById) ;
app.get('/api/articles/:article_id/comments', getArticleComments)
app.post('/api/articles/:article_id/comments', postCommentInArticle)

app.all('*', handle404Paths);
app.use(handleCustomerErrors)
app.use(handle400);
app.use(handle500s);


module.exports = app;