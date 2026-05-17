let express=require('express')
const createUser = require('./controller/userController')
let route=express.Router()


route.get('/register',createUser)

module.exports=route