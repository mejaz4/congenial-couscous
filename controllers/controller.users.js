const { selectUsers } = require('../models/model.users')



const getUsers = (req,res)=>{
    selectUsers().then((users) => {
    res.status(200).send({ users });
})
}


module.exports = { getUsers }
