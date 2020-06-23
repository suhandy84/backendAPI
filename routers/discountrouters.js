const express=require('express')
const {Discountcontrollers}=require('./../controllers')
const {auth}=require('./../helper/jwtauth')


const router=express.Router()

router.get('/getdiscount',Discountcontrollers.getdiscounts)
router.post('/adddiscount',auth,Discountcontrollers.adddiscounts)
router.put('/editdiscount/:id',auth,Discountcontrollers.editdiscounts)
router.delete('/deletediscount/:id',Discountcontrollers.deletediscounts)


module.exports=router