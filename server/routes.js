let express=require('express')
const passport = require('passport');
const { loginAdmin, createAdmin } = require('./controller/adminController')
const { createUser, loginUser } = require('./controller/userController')

const userRoute = express.Router()

userRoute.get('/profile', passport.authenticate('jwt', { session: false }),
    function(req, res) {
        res.status(200).json({
          id:req.user._id,
          fullname:req.user.fullname,
          email:req.user.email,
          role:req.user.role
        })
    
    }
);
userRoute.post('/register', createUser)
userRoute.post('/login', loginUser)

const adminRoute = express.Router()
// admin route
adminRoute.post('/createAdmin', createAdmin)
adminRoute.post('/loginAdmin', loginAdmin)

module.exports = { userRoute, adminRoute }