import express from 'express'
import { getAllProducts , createProducts, updateProduct, deleteProduct, getSingleProduct } from '../controller/productController.js'
import { verifyUserAuth , roleBasedAccess } from '../middleware/userAuth.js';

const router = express.Router()
//Routes 
router.route("/products" )
.get(verifyUserAuth , getAllProducts)
.post(verifyUserAuth , roleBasedAccess("admin") , createProducts);


router.route("/product/:id")
.put(verifyUserAuth , roleBasedAccess("admin"),updateProduct)
.delete(verifyUserAuth , roleBasedAccess("admin"),deleteProduct)
.get(verifyUserAuth,getSingleProduct)


export default router