const mongoose = require("mongoose")
const ledgermodel = require("./ledger.model")
const { $where } = require("./user.model")


const accountschema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: [true,"Without user account cannot be created"],
        index: true
    },
    status:{
        type: String,
        enum:{
            values:["ACTIVE","FROZEN","CLOSED"],
            message: "Status can be either ACTIVE,FROZEN OR CLOSED"
        },
        default: "ACTIVE"
    },
    currency:{
        type: String,
        required:[true,"currency is required for account"],
        default: "INR"
    }
},{
    timestamps: true
})

accountschema.index({user:1, status:1})

accountschema.methods.getBalance = async function(){
    const balancedata = await ledgermodel.aggregate([
        {$match:{account: this._id}},
        {
            $group:{
                _id: null,
                totaldebit:{
                    $sum:{
                        $cond:[
                            {$eq:["$type","DEBIT"]},
                            "$amount",
                            0
                        ]
                    }
                },
                totalcredit:{
                    $sum:{
                        $cond:[
                            {$eq:["$type","CREDIT"]},
                            "$amount",
                            0
                        ]
                    }
                }
            }
        },{
            $project:{
                _id: 0,
                balance:{$subtract:  ["$totalcredit","$totaldebit"]
            }
        }
       }
    ])
    if(balancedata.length === 0){
        return 0
    }
    return balancedata[0].balance
}

const accountModel = mongoose.model("accounts",accountschema)

module.exports = accountModel;

