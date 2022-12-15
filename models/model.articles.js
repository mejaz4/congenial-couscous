const db = require("../db/connection.js")


const selectArticles = () => {
return db.query(`SELECT articles.author, title, articles.article_id, topic, articles.created_at, articles.votes, COUNT(comments.comment_id) AS comment_count FROM articles
LEFT JOIN comments
ON articles.article_id = comments.article_id
GROUP BY articles.article_id
ORDER BY created_at DESC;`)
.then((result) => {
    return result.rows;
})
}


const selectArticleById = (article_id) => {
    const SQL = `SELECT author, title, article_id, body, topic, created_at, votes FROM articles
    WHERE article_id = $1`;
    
    return db.query(SQL, [article_id]).then((results) => {
        if (results.rowCount === 0) {
            return Promise.reject({status: 404, msg: 'Not Found'});
        }
        return results.rows[0];
    })
};

const selectArticleComments = (article_id) => {
    const SQL = `SELECT comment_id, comments.votes, comments.created_at, comments.author, comments.article_id, comments.body FROM comments
    WHERE article_id = $1
    ORDER BY comments.created_at DESC;`;

    return db.query(SQL, [article_id]).then((results) => {
        if (results.rowCount === 0) {
            return Promise.reject({status: 404, msg: 'Not Found'});
        }
        return results.rows;
    })
}

module.exports = { selectArticles, selectArticleById, selectArticleComments }