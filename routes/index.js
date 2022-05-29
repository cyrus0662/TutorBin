const express = require("express");
const router = express.Router();

const auth = require("./authRoute");
const todo = require("./todoRoute");

router.use('/auth', auth);
router.use('/todo', todo);

module.exports = router;