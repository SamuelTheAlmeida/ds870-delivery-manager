const express = require("express");
const motoboyRouter = express.Router();
const motoboyController = require("../controllers/MotoboyController");
const auth = require("../middlewares/auth");
const requestValidator = require("../middlewares/schemaValidator")

//sellerRouter.post("/authentication", requestValidator, sellerController.authentication);

motoboyRouter.get("/listar", motoboyController.listarTodos);
motoboyRouter.post("/buscarPorCPF", motoboyController.buscarPorCPF);
motoboyRouter.post("/novo", motoboyController.novo);
motoboyRouter.delete("/excluir/:id", motoboyController.excluir);
motoboyRouter.put("/atualizar", motoboyController.atualizar);

module.exports = motoboyRouter;