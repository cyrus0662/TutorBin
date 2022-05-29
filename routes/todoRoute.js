const express = require("express");

const TodoService = require("../services/todo");
const { auth } = require('../middlewares/checkAuth');

const router = express.Router();

let serviceInst = new TodoService();

router.post("/create", auth, serviceInst.createTodo);
router.get("/details", auth, serviceInst.getDetails);
router.patch("/update/:id", auth, serviceInst.updateDetailsByID);
router.delete("/remove/:id", auth, serviceInst.deletebyID);

module.exports = router;