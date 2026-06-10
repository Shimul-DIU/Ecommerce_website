let express=require('express')
const { loginAdmin, createAdmin } = require('./controller/adminController')
const { createUser, loginUser } = require('./controller/userController')

const userRoute = express.Router()
userRoute.post('/register', createUser)
userRoute.post('/login', loginUser)

const adminRoute = express.Router()
// admin route
adminRoute.post('/createAdmin', createAdmin)
adminRoute.post('/loginAdmin', loginAdmin)

module.exports = { userRoute, adminRoute }