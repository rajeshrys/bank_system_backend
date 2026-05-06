const app= require("./src/app")
const connectdb = require("./src/db/db")
require("dotenv").config();

connectdb();

app.listen(process.env.PORT,(req,res)=>{
    console.log("Server running at localhost:3000");
})