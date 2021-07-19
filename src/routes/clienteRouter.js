const express = require("express");
const clienteRouter = express.Router();
const clienteController = require("../controllers/clienteController");
const auth = require("../middlewares/auth");

//sellerRouter.post("/authentication", requestValidator, sellerController.authentication);

clienteRouter.get("/listar", clienteController.listarTodos);
clienteRouter.post("/buscarPorCNPJ", clienteController.buscarPorCNPJ);
clienteRouter.post("/novo", clienteController.novo);
clienteRouter.delete("/excluir/:id", clienteController.excluir);
clienteRouter.put("/atualizar", clienteController.atualizar);

module.exports = clienteRouter;