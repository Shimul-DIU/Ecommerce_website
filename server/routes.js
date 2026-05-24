let express=require('express')
const { loginAdmin, createAdmin } = require('./controller/adminController')
let route=express.Router()


route.post('/register',createUser)
route.post('/login',loginUser)



// admin route
route.post('/createAdmin',createAdmin)
route.get('/loginAdmin',loginAdmin)


module.exports=route