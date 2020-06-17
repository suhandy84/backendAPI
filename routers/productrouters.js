const express=require('express')
const {Productcontrollers}=require('./../controllers')
const {auth}=require('./../helper/jwtauth')


const router=express.Router()

router.get('/category',Productcontrollers.getcategory)
router.post('/addprod',auth,Productcontrollers.addproducts)
router.get('/getprod',Productcontrollers.getproducts)
router.delete('/deleteprod/:id',Productcontrollers.deleteproducts)
router.put('/editprod/:id',auth,Productcontrollers.editproducts)
router.get('/producthome',Productcontrollers.getproductshome)
router.get('/filterprod/:id',Productcontrollers.filterproducts)


module.exports=router