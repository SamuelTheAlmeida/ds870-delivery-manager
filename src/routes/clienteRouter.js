const express = require("express");
const clienteRouter = express.Router();
const clienteController = require("../controllers/clienteController");
const auth = require("../middlewares/auth");

clienteRouter.get("/listar", auth, clienteController.listarTodos);
clienteRouter.post("/buscarPorCNPJ", auth, clienteController.buscarPorCNPJ);
clienteRouter.post("/novo", auth, clienteController.novo);
clienteRouter.delete("/excluir/:id", auth, clienteController.excluir);
clienteRouter.put("/atualizar", auth, clienteController.atualizar);

module.exports = clienteRouter;