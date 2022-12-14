const express = require('express');
const {getTopics} = require('./controllers/controller.topics')
const {getArticles} = require('./controllers/controller.articles')

const app = express();
const {handle404Paths} = require('./error.controller')


app.get('/api/topics', getTopics);
app.get('/api/articles', getArticles);

app.all('*', handle404Paths);



module.exports = app;