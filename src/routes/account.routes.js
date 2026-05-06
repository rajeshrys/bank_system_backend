const express = require("express");
const router = express.Router()
const authmiddleware = require("../middlewares/auth.middleware")
const accountcontroller = require("../controllers/account.controller")

// Creation of accounts 

router.post("/",authmiddleware.authMiddleware,accountcontroller.createaccountcontroller)



module.exports = router