import Product from '../models/productModel.js'

export const createProducts = async ( req , res ) => {
    const product = await Product.create(req.body) 
    res.status(201).json({
        success:true,
        product : product
    })
}

export const getAllProducts = ( req , res ) => {
    res.status(200).json({
        message: "All Products"
    })
}
