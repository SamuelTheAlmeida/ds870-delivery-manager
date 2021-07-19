const express = require("express");
const entregaRouter = express.Router();
const entregaController = require("../controllers/entregaController");
const auth = require("../middlewares/auth");

entregaRouter.get("/listar", auth, entregaController.listarTodas);
entregaRouter.get("/listarRealizadas", auth, entregaController.listarRealizadas);
entregaRouter.get("/listarPendentes", auth, entregaController.listarPendentes);
entregaRouter.get("/listarPorMotoboy/:id", auth, entregaController.listarPorMotoboy);
entregaRouter.post("/novo", auth, entregaController.novo);
entregaRouter.delete("/excluir/:id", auth, entregaController.excluirPendente);
entregaRouter.put("/atualizar", auth, entregaController.atualizarPendente);

module.exports = entregaRouter;