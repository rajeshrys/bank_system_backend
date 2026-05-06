const express = require('express');
const router = express.Router();
const authcontroller = require("../controllers/auth.controller")

// api/auth/register
router.post("/register",authcontroller.userregistercontroller)

//api/auth/login
router.post("/login",authcontroller.userlogincontroller)

// api/auth/logout
router.post("/logout",authcontroller.userlogoutcontroller)

module.exports = router