const mongoose = require("mongoose")

const tokenblacklistschema = new mongoose.Schema({
    token:{
        type: String,
        required:[true,"token is required"],
        unique:[true,"token is already blacklisted"]
    },
    blacklistat:{
        type: Date,
        default: Date.now,
        immutable: true
    },

},{
    timestamps:true
})

tokenblacklistschema.index({createdAt:1},{
    expireAfterSeconds: 60*60*24 *3 // 3 days
})

const tokenblacklistmodel = mongoose.model("tokenblacklist",tokenblacklistschema)

module.exports = tokenblacklistmodel;