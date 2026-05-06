const mongoose = require("mongoose");
const { defaultMaxListeners } = require("nodemailer/lib/xoauth2");

const transactionSchema = new mongoose.Schema({
    fromaccount:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "accounts",
        required:[true,"Transaction must be associated with fromaccount"],
        index: true
    },
    toaccount:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "accounts",
        required:[true,"Transaction must be associated with toaccount"],
        index: true
    },
    status:{
        type: String,
        enum:{
            values: ["PENDING","COMPLETE","FAILED","REVERSED"],
            message: "transaction can be PENDING,COMPLETE,FAILED OR REVERSED"
        },
        default: 'PENDING'
    },
    amount:{
        type: Number,
        required: [true,"Amount is required for transaction"],
        min:[0,"Transaction cannot be negative"]
    },
    idempotencyKey:{
        type: String,
        required: [true,"idempotencyKey is required for transaction"],
        index: true,
        unique: true
    }

},{
    timestamps: true
})

const transactionmodel = mongoose.model("transactions",transactionSchema)

module.exports = transactionmodel;