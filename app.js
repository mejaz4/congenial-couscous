const express = require('express');
const {getTopics} = require('../be-nc-news/controllers/controllers.topics')
const app = express();
const {handle404Paths} = require('./controllers/controllers.errors')


app.get('/api/topics', getTopics);
app.all('*', handle404Paths);



module.exports = app;