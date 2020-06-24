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
router.get('/filterdiscount',Productcontrollers.filterdiscountproducts)
router.get('/filterprodpage/:id',Productcontrollers.filterproductspage)
router.get('/getproduct',Productcontrollers.getProductUser)
router.get('/gettotalproduct',Productcontrollers.gettotalproduk)
// router.get('/getfilterproduct',Productcontrollers.getFilterProductUser)
// router.get('/getproductuser',Productcontrollers.getProductUser)
// router.get('/getallproduct',Productcontrollers.getAllProductUser)
// router.get('/totalproduct',Productcontrollers.getTotalProduct)
router.get('/getdetailprod/:id',Productcontrollers.getdetailproduk)


module.exports=router