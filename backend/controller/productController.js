import Product from '../models/productModel.js'
import HandleError from '../utils/handleError.js'
import handleAsyncError from '../middleware/handleAsyncError.js'
import APIFunctionality from '../utils/apifunctionality.js'

export const createProducts = handleAsyncError(async ( req , res , next)  => {
    req.body.user = req.user.id;
    const product = await Product.create(req.body) 
    res.status(201).json({
        success:true,
        product : product
    })
})

export const getAllProducts = handleAsyncError(async ( req , res , next ) => {
    const resultsPerPage = 3;
    const apiFeatures = new APIFunctionality(Product.find() , req.query).search().filter();
    // console.log(apiFunctionality);
    const filteredQuery = apiFeatures.query.clone();
    const productCount = await filteredQuery.countDocuments()
    // console.log(productCount);
    const totalPages = Math.ceil(productCount/resultsPerPage)
    const page = Number(req.query.page) || 1
    if(page > totalPages && productCount > 0){
        return next(new HandleError("This Page doesn't exist" , 404));
    }
    
    
    //Applying Pagination here 
    apiFeatures.pagination(resultsPerPage)
    const products = await apiFeatures.query;
    if(!products || products.length === 0) {
        return next(new HandleError("No Product Found" , 404))
    }


    // console.log(products);
    res.status(200).json({
        message: "All Products",
        products: products,
        productCount ,
        totalPages,
        currentPage : page
    })
})

export const updateProduct = handleAsyncError(async ( req , res , next) => {
    const product = await Product.findByIdAndUpdate( req.params.id , req.body ,{
        returnDocument: 'after',
        runValidators:true
    } )
    if(!product){
        return next(new HandleError( "Product not found" , 500 ))
    }
    res.status(200).json({
        success:true,
        product:product
    })
})

export const deleteProduct =  handleAsyncError(async ( req , res , next) => {
    const product = await Product.findByIdAndDelete(req.params.id)
    if(!product){
        return next(new HandleError( "Product not found" , 500 ))
    }
    res.status(200).json({
        success:true,
        message:"Product Deleted Successfully"
    })
})

export const getSingleProduct =  handleAsyncError(async ( req , res , next) => {
    let product = await Product.findById(req.params.id)
    if(!product){
        return next(new HandleError( "Product not found" , 500 ))
    }
    res.status(200).json({
        success:true,
        product:product
    })
})
// creating and Updating a review(access level - User and admin)
export const createReviewForProduct =  handleAsyncError(async ( req , res , next) => {
    const {rating , comment , productId} = req.body
    const review = {
        user:req.user._id,
        name:req.user.name,
        rating:Number(rating),
        comment
    }
    const product = await Product.findById(productId);
    //console.log(product) 
    //console.log(req.user)
    //console.log(review.user)
    const reviewExist = product.reviews.find(review => review.user.toString() === req.user.id.toString())
    if(reviewExist){
        product.reviews.forEach(review => {
            if(review.user.toString() === req.user.id){
                review.rating = rating,
                review.comment = comment
            }
        })
    }else{
        product.reviews.push(review)
    }
    product.numOfReviews = product.reviews.length
    let sumOfRatings = 0;
    product.reviews.forEach(review => {
        sumOfRatings += review.rating;
    })
    product.ratings  = (product.reviews.length > 0) ? sumOfRatings/(product.reviews.length) : 0
    await product.save({validateBeforeSave:false})
    res.status(200).json({
        success:true,
        product
    })
})
//Getting Reviews
export const getProductReviews = handleAsyncError(async(req,res,next) => {
    const product = await Product.findById(req.query.id);
    if(!product){
        return next(new HandleError("No Product exist with this id" , 400));
    }
    res.status(200).json({
        success:true,
        reviews: product.reviews
    })

})
//Deleting Reviews
export const deleteReview = handleAsyncError(async(req,res,next) => {
    const product = await Product.findById(req.query.productId);
    if(!product){
        return next(new HandleError("Product doesn't exist" , 400))
    }
    const reviews = product.reviews.filter(review=>review._id.toString() !== req.query.id.toString())
    product.reviews = reviews
    let sumOfRatings = 0;
    product.reviews.forEach(review => {
        sumOfRatings += review.rating;
    })
    product.ratings  = (product.reviews.length > 0) ? sumOfRatings/(product.reviews.length) : 0
    product.numOfReviews = product.reviews.length
    await product.save({validateBeforeSave:false})
})


//Admin getting all products 
export const getAdminProducts = handleAsyncError(async(req,res,next)=> {
    const products = await Product.find();
    res.status(200).json({
        success:true,
        products
    })
})


