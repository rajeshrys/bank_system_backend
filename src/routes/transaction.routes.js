const {Router}  = require("express")
const authmiddleware = require("../middlewares/auth.middleware")
const transactioncontroller = require("../controllers/transaction.controller")
const transactionroutes = Router();

// Creating a transaction

transactionroutes.post("/",authmiddleware.authMiddleware,transactioncontroller.createtransaction)

// initial funds 
// api/transactions/initialfunds
transactionroutes.post("/initialfunds",authmiddleware.authSystemMiddleware,transactioncontroller.createinitialfunds)

// get all account of user 

transactionroutes.get("/getaccount",authmiddleware.authMiddleware,transactioncontroller.getuseraccount)

// get balance of account

transactionroutes.get("/getbalance/:id",authmiddleware.authMiddleware,transactioncontroller.getbalanceaccount)


module.exports = transactionroutes;
