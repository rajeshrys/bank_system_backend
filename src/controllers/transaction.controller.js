const transactionModel = require("../models/transaction.model")
const ledgerModel = require("../models/ledger.model")
const accountModel = require("../models/account.model")
const emailService = require("../services/email.service");
const transactionmodel = require("../models/transaction.model");
const mongoose = require("mongoose");
const usermodel  = require("../models/user.model")

/**
 * - Create a new transaction
 * THE 10-STEP TRANSFER FLOW:
 * 1. Validate request
 * 2. Validate idempotency key
 * 3. Check account status
 * 4. Derive sender balance from ledger
 * 5. Create transaction (PENDING)
 * 6. Create DEBIT ledger entry
 * 7. Create CREDIT ledger entry
 * 8. Mark transaction COMPLETED
 * 9. Commit MongoDB session
 * 10. Send email notification
 */

async function createtransaction(req,res){

    // validate request
    const {fromaccount,toaccount,amount,idempotencyKey}  = req.body;

    if(!fromaccount|| !toaccount||!amount||!idempotencyKey){
        return res.status(400).json({
            message: "required fields are missing"
        })
    }
     const fromuseraccount = await accountModel.findOne({_id: fromaccount})
     const touseraccount = await accountModel.findOne({_id: toaccount})

     if(!fromuseraccount || !touseraccount){
        return res.status(400).json({
            message:"Fromaccount or toaccount are missing"
        })
     }

    // 2. Validate idempotency key
    const istransactionexists = await transactionModel.findOne({
        idempotencyKey: idempotencyKey
    })
    if(istransactionexists){
        if(istransactionexists.status === 'COMPLETE'){
            return res.status(200).json({
                message:"transaction already processed",
                transaction: istransactionexists
            })
        }
         if(istransactionexists.status === 'PENDING'){
            return res.status(200).json({
                message:"transaction still in  processing",
                transaction: istransactionexists
            })
        }
         if(istransactionexists.status === 'FAILED'){
            return res.status(500).json({
                message:"TRANSACTION FAILED",
                transaction: istransactionexists
            })
        }
         if(istransactionexists.status === 'REVERSED'){
            return res.status(500).json({
                message:"TRANSACTION REVERSED PLEASE RETRY",
                transaction: istransactionexists
            })
        }
    }

    // 3. Check account status
    if(fromuseraccount.status !== 'ACTIVE' || touseraccount.status !== 'ACTIVE'){
        return res.status(400).json({message:"fromaccount  or toaccount are not active "})
    }

    // 4. Derive sender balance from ledger
    const balance = await fromuseraccount.getBalance()

    if(balance < amount ){
        return res.status(400).json({message:`Insufficient funds.Balance is ${balance}`})
    }

    // 5. Create transaction (PENDING)
    const session = await mongoose.startSession()
    session.startTransaction()

    const transaction = new transactionmodel({
        fromaccount,
        toaccount,
        amount,
        idempotencyKey,
        status:"PENDING"
    })

    const debitledger = await ledgerModel.create([{
        account: fromaccount,
        amount: amount,
        transaction: transaction._id,
        type: "DEBIT",

    }],{session})

    const creditledger = await ledgerModel.create([{
        account: toaccount,
        amount: amount,
        transaction: transaction._id,
        type: "CREDIT",

    }],{session})

    transaction.status = 'COMPLETE'
    await transaction.save({session})

    await session.commitTransaction()
    session.endSession()

    // 10. Send email notification
    await emailService.sendTransactionEmail(req.user.email,req.user.name,amount,toaccount)
    return res.status(200).json({
        message:"Transaction Completed successsfully",
        transaction: transaction
    })

}

async function createinitialfunds(req,res){
    const {toaccount,amount,idempotencyKey} = req.body

    if(!toaccount||!amount||!idempotencyKey){
        return res.status(401).json({
            message:"required fields are missing"
        })
    }

    const touseraccount = await accountModel.findOne({
        _id: toaccount
    })

    if(!touseraccount){
        return res.status(401).json({
            message:"invalid account"
        })
    }
    
    const systemUser = await usermodel.findOne({
    systemuser: true
    })

    if(!systemUser){
    return res.status(404).json({
        message: "System user not found"
    })
    }
    const fromuseraccount = await accountModel.findOne({
    user: systemUser._id
})
    console.log(fromuseraccount)

    if(!fromuseraccount){
        return res.status(404).json({
            message:"System user account not found"
        })
    }

    const session = await mongoose.startSession()
    session.startTransaction()

    const transaction = new transactionModel({
        fromaccount: fromuseraccount._id,
        toaccount,
        amount,
        idempotencyKey,
        status:'PENDING'
    })

        const debitLedgerEntry = await ledgerModel.create([{
        account: fromuseraccount._id,
        amount: amount,
        transaction: transaction._id,
        type: "DEBIT"
    }], { session })


    const creditLedgerEntry = await ledgerModel.create([{
        account: toaccount,
        amount: amount,
        transaction: transaction._id,
        type: "CREDIT"
    }], { session })

    transaction.status = 'COMPLETE'
    await transaction.save({session})

    await session.commitTransaction()
    session.endSession()

    return res.status(201).json({
        message:"Initial funds transaction completed successfully",
        transaction: transaction
    })
}

async function getuseraccount(req,res){
    const account = await accountModel.find({
        user: req.user._id,
    })
    res.status(200).json({
        message:"successfully fetched account",
        account
    })
}

async function getbalanceaccount(req,res){
    const accountid  = req.params.id

    const account = await accountModel.findOne({
        _id: accountid,
        user: req.user._id
    })

    if(!account){
        return res.status(404).json({
            message:"Account not found"
        })
    }

    const balance = await account.getBalance();
    res.status(200).json({
        message:"Balance fetched successfully",
        balance
    })

}

module.exports = {
    createtransaction,
    createinitialfunds,
    getuseraccount,
    getbalanceaccount
}