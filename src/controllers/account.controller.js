const accountmodel = require("../models/account.model")

// Creation of account for user 
async function createaccountcontroller(req,res){

    const user = req.user;
    

    const existingAccount = await accountmodel.findOne({
        user: user
    })
    console.log(existingAccount)


    if(existingAccount){
        return res.status(400).json({
            message:"Account already exists for this user"
        })
    }

    const account = await accountmodel.create({
        user: user._id,
    })
    console.log(account)
    

    res.status(201).json({
        message:"Account Creation Successful",
        account
    })
}

module.exports = {createaccountcontroller}