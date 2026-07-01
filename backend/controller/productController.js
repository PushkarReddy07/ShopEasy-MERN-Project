import Product from '../models/productModel.js'
import HandleError from '../utils/handleError.js'
import handleAsyncError from '../middleware/handleAsyncError.js'
import APIFunctionality from '../utils/apifunctionality.js'

export const createProducts = handleAsyncError(async ( req , res , next)  => {
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
        new : true,
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
