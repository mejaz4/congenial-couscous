const express = require('express');
const {getTopics} = require('./controllers/controller.topics')
const {getUsers} = require('./controllers/controller.users')
const { patchVotesInArticle, getArticles, getArticleById, getArticleComments, postCommentInArticle} = require('./controllers/controller.articles')
const cors = require('cors');
const app = express();

app.use(cors());


const {handle404Paths, handleSql, handleCustomerErrors, handle500s} = require('./error.controller');
const seed = require('./db/seeds/seed');
const devData = require('./db/data/development-data')
app.use(express.json())

app.get('/api/topics', getTopics);
app.get('/api/articles', getArticles);
app.get('/api/articles/:article_id', getArticleById) ;
app.get('/api/articles/:article_id/comments', getArticleComments)
app.post('/api/articles/:article_id/comments', postCommentInArticle)
app.patch('/api/articles/:article_id', patchVotesInArticle)
app.get('/api/users', getUsers);
app.get('/api/seed', (req, res, next) => {
     seed(devData).then(() => {
        res.send({msg:'seeded okay'})
     });
})

app.all('*', handle404Paths);
app.use(handleCustomerErrors)
app.use(handleSql);
app.use(handle500s);

module.exports = app;