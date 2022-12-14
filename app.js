const express = require('express');
const {getTopics} = require('./controllers/controller.topics')
const {getArticles, getArticleById} = require('./controllers/controller.articles')

const app = express();
const {handle404Paths} = require('./error.controller')


app.get('/api/topics', getTopics);
app.get('/api/articles', getArticles);
app.get('api/articles/:article_id', getArticleById) ;

app.all('*', handle404Paths);



module.exports = app;