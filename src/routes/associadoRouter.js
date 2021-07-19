const express = require("express");
const associadoRouter = express.Router();
const associadoController = require("../controllers/associadoController");
const auth = require("../middlewares/auth");

associadoRouter.get("/listar", associadoController.listarTodos);
associadoRouter.post("/buscarPorCNPJ", associadoController.buscarPorCNPJ);
associadoRouter.post("/novo", associadoController.novo);
associadoRouter.delete("/excluir/:id", associadoController.excluir);
associadoRouter.put("/atualizar", associadoController.atualizar);

module.exports = associadoRouter;