const express = require("express");
const loginRouter = express.Router();
const loginController = require("../controllers/loginController");
const auth = require("../middlewares/auth");
const requestValidator = require("../middlewares/schemaValidator")

loginRouter.post("/", loginController.login);

module.exports = loginRouter;