const mongoose = require("mongoose");
require("dotenv").config();
const dns = require("node:dns");
dns.setServers(["1.1.1.1","8.8.8.8"]);



async function connectdb() {
    try{
        await mongoose.connect(process.env.MONGOOSE_URL)
        console.log("connected to database");
    }
    catch(err){
        console.log('Error during connection',err.message)
    }
}

module.exports = connectdb;