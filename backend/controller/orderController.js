import Order from '../models/orderModel.js'
import Product from '../models/productModel.js'
import User from '../models/userModel.js'
import HandleError from '../utils/handleError.js'
import handleAsyncError from '../middleware/handleAsyncError.js'

//Create New Order
export const createNewOrder = handleAsyncError(async (req,res,next) =>{
    const {shippingInfo, orderItems , paymentInfo , itemPrice , taxPrice , shippingPrice , totalPrice} = req.body;
    const order = await Order.create({
        shippingInfo,
        orderItems,
        paymentInfo,
        itemPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paidAt:Date.now(),
        user:req.user._id
    })
    res.status(201).json({
        success:true,
        order
    })

})
//Getting Single Order for Admin
export const getSingleOrder = handleAsyncError(async (req,res,next) =>{
    const order = await Order.findById(req.params.id).populate("user" , "name email");
    if(!order){
        return next(new HandleError("No order found with this id",400))
    }
    res.status(200).json({
        success:true,
        order
    })
})
//My orders for LoggedIn users
export const allMyOrders = handleAsyncError(async (req,res,next) =>{
    const orders = await Order.find({user:req.user._id});
    if(!orders){
        return next(new HandleError("No orders found with this id",400))
    }
    res.status(200).json({
        success:true,
        orders
    })
})

//Getting All orders for admins
export const getAllOrders = handleAsyncError(async (req,res,next) =>{
    const orders = await Order.find();
    let totalAmtOfAllOrders = 0;
    orders.forEach(order=>{
        totalAmtOfAllOrders+=order.totalPrice;
    })
    res.status(200).json({
        success:true,
        orders,
        totalAmtOfAllOrders
    })
})
//Update Order Status
export const updateOrderStatus = handleAsyncError(async (req,res,next) =>{
    const order = await Order.findById(req.params.id);
    if(!order){
        return next(new HandleError("No orders found with this id",400))
    }
    if(order.orderStatus === 'Delievered'){
        return next(new HandleError("This order is already delievered" , 404))
    }
    if(req.body.status === 'Dispatched' && order.orderStatus != 'Dispatched') await Promise.all(order.orderItems.map(item=>updateQuantity(item.product,item.quantity)));
    order.orderStatus = req.body.status;
    if(order.orderStatus === 'Delievered'){
        order.delieveredAt = Date.now();
    }
    await order.save({validateBeforeSave:false})
    res.status(200).json({
        success:true,
        order
    })
})
//Updating Order Quantity when Admin finalises status of order
async function updateQuantity(id,quantity){
    const product = await Product.findById(id);
    if(!product){
        return next(new HandleError("This product doesn't exist" , 404))
    }
    product.stock -= quantity;
    await product.save({validateBeforeSave:false});
}
//Delete Order
export const deleteOrder = handleAsyncError(async (req,res,next) =>{
    const order = await Order.findById(req.params.id);
    if(!order){
        return next(new HandleError("No orders found with this id",400))
    }
    if(order.orderStatus !== 'Delievered'){
        return next(new HandleError("This order is under Processing",400));
    }
    await Order.deleteOne({_id:req.params.id})
    res.status(200).json({
        success:true,
        message:"order deleted successfully"
    })
})
