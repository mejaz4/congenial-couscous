const handle404Paths = (req, res) => {
    res.status(404).send({msg: 'Invalid Path'})
}


module.exports = {handle404Paths};