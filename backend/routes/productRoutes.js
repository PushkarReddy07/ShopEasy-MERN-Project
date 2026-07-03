import express from 'express'
import { getAllProducts , createProducts, updateProduct, deleteProduct, getSingleProduct, getAdminProducts, createReviewForProduct , getProductReviews , deleteReview} from '../controller/productController.js'
import { verifyUserAuth , roleBasedAccess } from '../middleware/userAuth.js';

const router = express.Router()
//Routes 
router.route("/products" )
.get(getAllProducts)
router.route("/admin/products" )
.get(verifyUserAuth, roleBasedAccess("admin") ,getAdminProducts)
router.route('/admin/product/create').post(verifyUserAuth , roleBasedAccess("admin") , createProducts);


router.route("/admin/product/:id")
.put(verifyUserAuth , roleBasedAccess("admin"),updateProduct)
.delete(verifyUserAuth , roleBasedAccess("admin"),deleteProduct)

router.route("/product/:id").get(getSingleProduct)
router.route("/review").put(verifyUserAuth,createReviewForProduct)
router.route("/reviews").get(verifyUserAuth,getProductReviews)
router.route("/reviews").get(verifyUserAuth,deleteReview)




export default router