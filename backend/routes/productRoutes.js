import express from 'express'
import { getAllProducts , createProducts, updateProduct, deleteProduct, getSingleProduct } from '../controller/productController.js'

const router = express.Router()
//Routes 
router.route("/products" )
.get(getAllProducts)
.post(createProducts);


router.route("/product/:id")
.put(updateProduct)
.delete(deleteProduct)
.get(getSingleProduct)


export default router