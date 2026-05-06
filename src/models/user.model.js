const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
    email:{
        type: String,
        required: [true,"Email is required for user creation"],
        trim: true,
        lowercase: true,
        match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
        ],
        unique: [true,"Email already exists"]
    },
    name:{
        type:String,
        required: [true,"Name is required for user creation"],
    },
    password:{
        type: String,
        required:[true,"password is required for user creation"],
        minlength:[6,"password should contain minimum 6 characters"],
        select: false
    },
    systemuser:{
        type: Boolean,
        default: false,
        immutable: true,
        select: false
    }
},{
    timestamps: true
})

userSchema.pre("save",async function(next){
    if(!this.isModified("password")){
            return 
    }
    const hash = await bcrypt.hash(this.password,10);
    this.password = hash

    return 

})

userSchema.methods.comparepassword = async function (password){
     return await bcrypt.compare(password,this.password)
}

const userModel = mongoose.model("user",userSchema);

module.exports = userModel;