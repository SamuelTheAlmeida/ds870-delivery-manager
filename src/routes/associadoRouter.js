const express = require("express");
const associadoRouter = express.Router();
const associadoController = require("../controllers/AssociadoController");
const auth = require("../middlewares/auth");
const requestValidator = require("../middlewares/schemaValidator")

associadoRouter.get("/listar", associadoController.listarTodos);
associadoRouter.post("/buscarPorCNPJ", associadoController.buscarPorCNPJ);
associadoRouter.post("/novo", associadoController.novo);
associadoRouter.delete("/excluir/:id", associadoController.excluir);
associadoRouter.put("/atualizar", associadoController.atualizar);

module.exports = associadoRouter;