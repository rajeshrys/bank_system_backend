const mongoose = require("mongoose");

const ledgerSchema = new mongoose.Schema({
    account:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "accounts",
        required: [true,"ledger must be associated with an account"],
        index: true,
        immutable: true
    },
    amount:{
        type: Number,
        required: [true,"Amount is required"],
        immutable: true,
    },
    transaction:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "transactions",
        required: [true,"transaction is required"],
        index: true,
        immutable: true
    },
    type:{
        type: String,
        enum:{
            values: ['CREDIT','DEBIT'],
            message:"type can be CREDIT OR DEBIT"
        },
        required: [true,"type is required"],
        immutable: true
    }
},{
    timestamsps: true
})

function preventLedgerModification(){
    throw new Error("Ledger entries cannot be modified")
}

ledgerSchema.pre('findOneAndUpdate', preventLedgerModification);
ledgerSchema.pre('updateOne', preventLedgerModification);
ledgerSchema.pre('deleteOne', preventLedgerModification);
ledgerSchema.pre('remove', preventLedgerModification);
ledgerSchema.pre('deleteMany', preventLedgerModification);

const ledgerModel = mongoose.model('ledger', ledgerSchema);

module.exports = ledgerModel;