const handle404Paths = (req, res) => {
    res.status(404).send({msg: 'Not Found'})
}

const handle400 = (err, req, res, next) => {
    if (err.code === '22P02') {
        res.status(400).send({ msg: 'Bad Request'})
    } else {
        next(err)
    }
}
const handleCustomerErrors = (err, req, res, next) => {
    if (err.msg && err.status) {
        res.status(err.status).send({ msg: err.msg});
    } else {
        next(err);
    }
}


const handle500s = (err, req, res, next) => {
    res.status(500).send({ msg: 'server eror, soz!'})
}


module.exports = {handle404Paths, handleCustomerErrors, handle500s, handle400};