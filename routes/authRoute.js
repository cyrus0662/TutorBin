const express = require("express");

const AuthService = require("../services/auth");

const router = express.Router();

let serviceInst = new AuthService();

router.post("/register", serviceInst.signUp);
router.post("/login", serviceInst.login);

module.exports = router;