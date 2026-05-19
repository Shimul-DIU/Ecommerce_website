let express=require('express')
const {createUser,loginUser} = require('./controller/userController')
let route=express.Router()


route.post('/register',createUser)
route.post('/login',loginUser)

module.exports=route