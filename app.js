const express = require('express');
const {getTopics} = require('./controllers/controller.topics')
const {getArticles, getArticleById} = require('./controllers/controller.articles')

const app = express();


const {handle404Paths, handle400, handleCustomerErrors, handle500s} = require('./error.controller')


app.get('/api/topics', getTopics);
app.get('/api/articles', getArticles);
app.get('/api/articles/:article_id', getArticleById) ;


app.all('*', handle404Paths);
app.use(handleCustomerErrors)
app.use(handle400);
app.use(handle500s);


module.exports = app;