const express=require('express')
const {Authcontrollers}=require('../controllers')
const router=express.Router()
const {auth}=require('../helper/jwtauth')

router.post('/register',Authcontrollers.userregister)
router.get('/verified',auth,Authcontrollers.userverified)
router.post('/sendmailverification',Authcontrollers.sendmailverified)
router.post('/sendmailforgotpassword',Authcontrollers.sendmailforgotpassword)
router.get('/forgotpasswordverified', auth, Authcontrollers.forgotpasswordverified)
router.post('/resetpassword', Authcontrollers.resetpassword)
router.get('/login', Authcontrollers.userlogin) 
router.get('/keeplogin', auth, Authcontrollers.keeplogin) //sudah pakai token sehingga tidak butuh params lagi, pakai req.user
// router.get('/keeplogin/:iduser', Usercontrollers.keeplogin) //paramsnya sama dengan di user controller
// router.put('/verified', Usercontrollers.userverified) 
// router.post('/fblogin', Usercontrollers.loginfacebook) 
module.exports=router