import Order from '../models/order.js'

const getOrderByUser = async(req, res) =>{
    try {

        const orders = await Order.find({
            buyer: req.user._id
        }).populate('products', '-photo').populate('buyer', 'name email address role')

        res.json(orders)
        
    } catch (error) {
        console.log(error)
        res.json({error})
    }
}

const userCancellOrder = async(req, res) =>{

    try {
        const {id} = req.params;


        const getOrderStatus = await Order.findById(id).select('status')

        const {status} = getOrderStatus;

        if(status === 'Not processed'){
            const updatedOrder = await Order.findByIdAndUpdate(id, {
            status: "Cancelled"
        }, {new: true});

        res.json(updatedOrder)
       }
       else{
        return res.json({error: 'Unable to cancel processed orders'})
       }
        
    } catch (error) {
        console.log(error)
    }
};

const getAllOrdersAdmin = async(req, res) =>{
    try {

        const userOrders = await Order.find({}).populate('buyer', 'email name address role').populate('products', '-photo')

        res.json(userOrders)
        
    } catch (error) {
        console.log(error)
    }
}

const adminUpdateStatus = async(req, res) =>{

    try {
        const {id} = req.params;

        const {status} = req.body;
      
            const updatedOrderStatus = await Order.findByIdAndUpdate(id, {
            status
        }, {new: true});

        res.json(updatedOrderStatus)      

        
    } catch (error) {
        console.log(error)
    }
};

export{
    getOrderByUser,
    userCancellOrder,
    getAllOrdersAdmin,
    adminUpdateStatus
}