import express from 'express'
import { getAllProducts , createProducts, updateProduct, deleteProduct, getSingleProduct, getAdminProducts } from '../controller/productController.js'
import { verifyUserAuth , roleBasedAccess } from '../middleware/userAuth.js';

const router = express.Router()
//Routes 
router.route("/admin/products" )
.get(verifyUserAuth, roleBasedAccess("admin") ,getAdminProducts)
router.route("/products" )
.get(getAllProducts)
router.route('/admin/product/create').post(verifyUserAuth , roleBasedAccess("admin") , createProducts);


router.route("/admin/product/:id")
.put(verifyUserAuth , roleBasedAccess("admin"),updateProduct)
.delete(verifyUserAuth , roleBasedAccess("admin"),deleteProduct)
.get(getSingleProduct)



export default router