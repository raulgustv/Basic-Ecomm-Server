import Product from '../models/product.js';
import fs from 'fs';
import slugify from 'slugify';
import braintree from 'braintree';
import * as dotenv from 'dotenv';
import Order from '../models/order.js'


dotenv.config('/server');


const gateway = new braintree.BraintreeGateway({
    environment: braintree.Environment.Sandbox,
    merchantId: process.env.BRAINTREE_MERCHANT_ID,
    publicKey:  process.env.BRAINTREE_PUBLIC_KEY,
    privateKey: process.env.BRAINTREE_PRIVATE_KEY
});


const createProduct = async (req, res) => {
    try {

        const {name, description, price, category, quantity, shipping} = req.fields;
        const {photo} = req.files;

        //validation
        switch(true){
            case !name.trim():
                res.json({error: 'Name is required'})                
            case !description.trim():
                res.json({error: 'Description is required'})
            case !price.trim():
                res.json({error: 'Price is required'})
            case !category.trim():
                res.json({error: 'Category is required'})
            case !quantity.trim():
                res.json({error: 'Quantity is required'})
            case !shipping.trim():
                res.json({error: 'Shipping availability is required'})
            
            case photo && photo.size > 100000000:
                res.json({error: 'Photo should be less than 1MB size'})
        }

        //create product 
        const product = new Product({...req.fields, slug: slugify(name)});

        if(photo){
            product.photo.data = fs.readFileSync(photo.path);
            product.photo.contentType = photo.type;
        }

        await product.save();

        res.json(product);

    } catch (error) {
        console.log(error)
        res.json({
            error: 'Error creating product'
        });
    }
};

const getProducts = async (req, res) => {
    try {

        const products = await Product.find().select('-photo').populate('category', 'name').limit(12).sort({createdAt: -1});

        res.json(products)

    } catch (error) {
        console.log(error)
        res.json({
            error: 'Error obtaining products'
        });
    }
}

const getProduct = async (req, res) =>{
    try {

        const {slug} = req.params;

        const product = await Product.findOne({slug}).populate('category', 'name').select('-photo');

        res.json(product)        
        
    } catch (error) {
        console.log(error)
        res.json({
            error: 'Error obtaining product'
        });
    }
}

const getPhoto = async (req, res) =>{
    try {

        const product = await Product.findById(req.params.productId).select("photo");
        if(product.photo.data){
            res.set('Content-Type', product.photo.contentType);
            return res.send(product.photo.data)
        }

        console.log(product)
        
    } catch (error) {
        console.log(error)
        res.json({
            error: 'Error obtaining product'
        });
    }
}

const removeProduct = async(req, res) =>{

    try {

        const {slug} = req.params;

        await Product.findOneAndDelete({slug}).select('photo');

        res.json({
            message: 'The product has been deleted'
        })
        
    } catch (error) {
        console.log(error)
        res.json({
            error: 'Error obtaining product'
        });
    }
}

const updateProduct = async(req, res) =>{
    try {

        const {name, description, price, category, quantity, shipping} = req.fields;
        const {photo} = req.files;

        //validation
        switch(true){
            case !name.trim():
                res.json({error: 'Name is required'})                
            case !description.trim():
                res.json({error: 'Description is required'})
            case !price.trim():
                res.json({error: 'Price is required'})
            case !category.trim():
                res.json({error: 'Category is required'})
            case !quantity.trim():
                res.json({error: 'Quantity is required'})
            case !shipping.trim():
                res.json({error: 'Shipping availability is required'})
            
            case photo && photo.size > 1000000:
                res.json({error: 'Photo should be less than 1MB size'})
        }

        //create product 
        const product = await Product.findOneAndUpdate({slug: req.params.slug}, {
            ...req.fields,
            slug: slugify(name)
        }, {new: true}).select('-photo').populate('category')

        if(photo){
            product.photo.data = fs.readFileSync(photo.path);
            product.photo.contentType = photo.type;
        }

        await product.save();

        res.json(product);

    } catch (error) {
        console.log(error)
        res.json({
            error: 'Error updating product'
        });
    }
}

const filteredProducts = async(req, res) =>{
    
    const {checked, slider} = req.body;

    let args = {}; 

    if(checked.length > 0){
        args.category = checked
    }
    if(slider.length){
        args.price = {$gte: slider[0], $lte: slider[1]}
    }

    const products = await Product.find(args);

    console.log(products.length
        )

    res.json(products)   

}

const productsCount = async(req, res) =>{
    try {

        const total = await Product.find({}).estimatedDocumentCount();
        res.json(total)
        
    } catch (error) {
        console.log(error)
    }
}

const productList = async (req, res) => {
    try {

        const perPage = 6;

        const page = req.params.page ? req.params.page : 1;

        const products = await Product.find().skip((page - 1) * perPage).limit(perPage).sort({createdAt: -1})
        .select('-photo')

        res.json(products)

    } catch (error) {
        console.log(error)
    }
}

const searchProduct = async (req, res) =>{
    const {keyword} = req.params;

    try {

        const results = await Product.find({
            $or: [
                {name: {$regex: keyword, $options: "i"}},
                {description: {$regex: keyword, $options: "i"}},
            ]
        }).select('-photo');      

        res.json(results)
        
    } catch (error) {
        console.log(error)
    }
}

const relatedProducts = async(req, res) =>{
    try {
        const {productId, categoryId} = req.params;        

        const related = await Product.find({
            category: categoryId,
            _id: {$ne: productId}
        }).select('-photo').populate('category', 'name').limit(3);

        res.json(related)

    } catch (error) {
        console.log(error)
    }
}

const getToken = async(req, res) =>{
    try {
    gateway.clientToken.generate({}, function(err, response){
        if(err){
            res.status(500).send(err)
        }else{
            res.send(response)
        }
    }) 
    } catch (error) {
        console.log(error)
    }
}

const processPayment = (req, res) =>{
    try {
        //const {total} = req.body;

       const {nonce, cart} = req.body;

       let total = 0;
       cart.map((i) => {
            total = total + i.price
       });
       

       //console.log(total)

        gateway.transaction.sale({
            amount: total,
            paymentMethodNonce: nonce,
            options: {
                submitForSettlement: true
            }
        }, function(error, result){
            if(result){
               res.json(result)
                //create an order
                new Order({
                    products: cart,
                    payment: result,
                    buyer: req.user._id
                }).save();
                //Reduce stock on sold items
                decrementQuantity(cart)
                //res.json(order)
            }else{
                res.status(500).send(error)
            }
        })

    } catch (error) {
       return res.json({message: error})
    }
}

const decrementQuantity = async(cart) =>{
    try {
        
       const bulkOps = cart.map((item) =>{
        return {
            updateOne: {
                filter: {_id: item._id},
                update: { $inc : {quantity: -1, sold: +1}}
            }
        }
       })

        Product.bulkWrite(bulkOps, {});

        //res.json({ok: true})

    } catch (error) {
        console.log(error)
    }
}

export {
    createProduct,
    getProducts,
    getProduct,
    getPhoto,
    removeProduct,
    updateProduct,
    filteredProducts,
    productsCount,
    productList,
    searchProduct,
    relatedProducts,
    getToken,
    processPayment
}