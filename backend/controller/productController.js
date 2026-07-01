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
    console.log(Product.find());
    // console.log(req.query);

    const apiFunctionality = new APIFunctionality(Product.find() , req.query).search();
    // console.log(apiFunctionality);
    const products = await apiFunctionality.query;
    console.log(products);
    res.status(200).json({
        message: "All Products",
        products: products
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
