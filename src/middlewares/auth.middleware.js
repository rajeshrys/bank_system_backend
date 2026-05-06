const accountModel = require("../models/account.model")
const tokenblacklistmodel = require("../models/blacklist.model")
const usermodel = require("../models/user.model")
const jwt = require("jsonwebtoken")
require("dotenv").config()

async function authMiddleware(req,res,next){
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1]
    console.log(token)
    if(!token){
        return res.status(401).json({
            message:"Unauthorized access token is missing"
        })
    }
    const isblacklisted = await tokenblacklistmodel.findOne({token})
    if(isblacklisted){
        return res.status(401).json({
            message:"Unauthorized access, token is invalid"
        })
    }

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);  
        
        const user = await usermodel.findById(decoded.userId);  
        if (!user) {
        return res.status(404).json({ message: 'User not found' });
        }

        req.user = user;
        next();
        }
    catch(err){
        return res.status(401).json({
            message:"Token is invalid"
        })
    }
    
    
}

async function authSystemMiddleware(req,res,next){
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1]

    if(!token){
        return res.status(401).json({
            message:"Unauthorized access token is missing"
        })
    }

    const isblacklisted = await tokenblacklistmodel.findOne({token})
    
    if(isblacklisted){
        return res.status(401).json({
            message:"Unauthorized access, token is invalid"
        })
    }

    try{

        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        const systemuser = await usermodel.findOne(decoded.id).select("+systemuser")
        if(!systemuser){
            return res.status(403).json({
                message:"Forbidden access not a systemuser"
            })
        }
        req.user = systemuser
         next()

    }catch(err){
        return res.status(401).json({
            message:"Token is invalid"
        })
    }
}



module.exports = {authMiddleware,authSystemMiddleware}