const usermodel = require("../models/user.model")
const jwt  = require("jsonwebtoken")
require("dotenv").config();
const emailservice = require("../services/email.service");
const tokenblacklistmodel = require("../models/blacklist.model");
//api/auth/register
async function userregistercontroller(req,res){
    const {email,name,password} = req.body;

    const isexists = await usermodel.findOne({email:email})

    if(isexists){
        return res.status(422).json({
            message:"user already exists",
            status: "failed"
        })
    }

    const user = await usermodel.create({
        name: name,
        email: email,
        password: password
    })

    const token = jwt.sign({
        userId: user._id
    },process.env.JWT_SECRET,{expiresIn:"3d"})

    await emailservice.sendRegistrationEmail(user.email,user.name)

    res.cookie("token",token);

    res.status(201).json({message:"User registration Successful",user:{
        _id: user.id,
        name: user.name,
        email: user.email,
    },token})

}

async function userlogincontroller(req,res){
    const{email,password} = req.body;
    const user = await usermodel.findOne({email:email}).select("+password");
    if(!user){
        return res.status(401).json({
            message:"User not found"
        })
    }
    const isvalidpass = await user.comparepassword(password)

    if(!isvalidpass){
        return res.status(401).json({
            message: "Email or password is invalid"
        })
    }

    const token = jwt.sign({
        userId: user._id
    },process.env.JWT_SECRET,{expiresIn:"3d"})

    res.cookie("token",token);

    res.status(201).json({message:"User Login Successful",user:{
        _id: user.id,
        name: user.name,
        email: user.email,
    },token})

}

async function userlogoutcontroller(req,res){
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1]

    if(!token){
        return res.status(400).json({message:"User logged out Successfully"});

    }

    res.clearCookie("token")
    await tokenblacklistmodel.create({
        token: token
    })
    res.status(200).json({message:"User logged out successfully"})
}


module.exports = {userregistercontroller,userlogincontroller,userlogoutcontroller}