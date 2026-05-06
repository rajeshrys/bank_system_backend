const express = require("express");
const authroutes = require("./routes/auth.routes");
const cookieParser = require("cookie-parser");
const accountroutes = require('./routes/account.routes')
const transactionroutes = require("./routes/transaction.routes")


const app = express();
app.use(express.json());
app.use(cookieParser());


app.use("/api/auth",authroutes)
app.use("/api/accounts",accountroutes)
app.use("/api/transactions",transactionroutes)

module.exports = app;