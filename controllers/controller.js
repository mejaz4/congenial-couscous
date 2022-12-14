const {selectArticles, selectTopics} = require('../models/model.topics')



const getTopics = (req,res)=>{
selectTopics().then((topics) => {
    res.status(200).send({ topics });
})
}

const getArticles = (req, res, next) => {
    // console.log("here")
    selectArticles().then((articles) => {
        // console.log("here??")
        res.status(200).send({articles})
    })
}

module.exports = {getTopics, getArticles}
