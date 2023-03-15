import User from '../models/user.js';
import {hashPassword, comparePassword} from '../helpers/auth.js';
import jwt from 'jsonwebtoken';


const register = async(req, res) =>{
    try {

        const {name, email, password} = req.body; 

        if(!name.trim() || !email.trim()){
            return res.json({
                error: "Name and email are required"
            })
        }

        if(!password || password.length < 6){
            return res.json({
                error: "Password is required and must be 6 characters long"
            })
        }

        //check email if taken
        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.json({
                error: "This user already exists"
            })
        }   
        
        //password hash
        const hashedPassword = await hashPassword(password)

        const user = await new User({name, email, password: hashedPassword});
        user.save();

        //create signed jwt
        const token = jwt.sign({_id: user._id}, process.env.JWT_SECRET, {expiresIn: '7d'})

        res.json({
            user: {
                name: user.name,
                email: user.email,
                role: user.role,
                address: user.address
            },
            token
        });
        
    } catch (error) {
        console.log(error)
    }
}

const login = async (req, res) =>{
    try {

        const {email, password} = req.body;

        if(!email){
            return res.json({
                error: "Email is required"
            })
        }

        if(!password || password.length < 6){
            return res.json({
                error: "Password is required"
            })
        }

        const user = await User.findOne({email});
        if(!user){
            return res.json({error: 'This user does not exist'})
        }

        //comparing password (validation)
        const match = await comparePassword(password, user.password) //user.password comes from the above user instance

        if(!match){
            return res.json({
                error: 'Email and password do not match'
            })
        }
         //create signed jwt
         const token = jwt.sign({_id: user._id}, process.env.JWT_SECRET, {expiresIn: '7d'});

         res.json({
            user: {
                name: user.name,
                email: user.email,
                role: user.role,
                address: user.address
            },
            token
        });

    } catch (error) {
        console.log(error)
    }
}

//test controller
const secret = async(req, res) =>{
    res.json({
        message: req.user
    })
}

const authCheck = (req, res) =>{
    res.json({
        ok: true
    })
};

const adminCheck = (req, res) =>{
    res.json({
        ok: true
    })
}

//profile
const profileUpdate = async(req, res) =>{
    const {name, password, address} = req.body;

    //console.log(name, password, address)
    const user = await User.findById(req.user._id);

    if(!user) return res.json({message: 'User does not exist'});
    if(password && password.length < 6) return res.json({message: 'Password is required and must be 6 characters long.'});

    //hash password
    const hashedPassword = password ? await hashPassword(password) : undefined;

    const updated = await User.findByIdAndUpdate(req.user._id, {
        name: name || user.name,
        password: hashedPassword || user.password,
        address: address || user.address
    }, {new: true});

    updated.password = undefined;

    res.json(updated)

    try {
        
    } catch (error) {
        console.log(error)
    }
}

export{
   register,
   login,
   secret, 
   authCheck,
   adminCheck,
   profileUpdate
}