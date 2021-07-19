const express = require("express");
const motoboyRouter = express.Router();
const motoboyController = require("../controllers/motoboyController");
const auth = require("../middlewares/auth");

//sellerRouter.post("/authentication", requestValidator, sellerController.authentication);

motoboyRouter.get("/listar", motoboyController.listarTodos);
motoboyRouter.post("/buscarPorCPF", motoboyController.buscarPorCPF);
motoboyRouter.post("/novo", motoboyController.novo);
motoboyRouter.delete("/excluir/:id", motoboyController.excluir);
motoboyRouter.put("/atualizar", motoboyController.atualizar);

module.exports = motoboyRouter;