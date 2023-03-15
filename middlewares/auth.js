import jwt from 'jsonwebtoken';
import User from '../models/user.js'

export const requireSignIn = (req, res, next) =>{
    try {
        

        const decoded = jwt.verify(req.headers.authorization, process.env.JWT_SECRET);  

        req.user = decoded;

        next();
        
    } catch (error) {
        return res.status(401).json(error)
    }
}

export const isAdmin = async (req, res, next) =>{
    try {

        const user = await User.findById(req.user._id); 

        if(user.role !== 1){
            return res.status(401).json({message: 'Unauthorized! You do not have permissions to access this resource'})
        }else{
            next();
        }      

        
    } catch (error) {
        return res.status(401).json(error)
    }
}