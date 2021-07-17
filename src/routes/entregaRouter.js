const express = require("express");
const entregaRouter = express.Router();
const entregaController = require("../controllers/EntregaController");
const auth = require("../middlewares/auth");
const requestValidator = require("../middlewares/schemaValidator")

entregaRouter.get("/listar", entregaController.listarTodas);
entregaRouter.get("/listarRealizadas", entregaController.listarRealizadas);
entregaRouter.get("/listarPendentes", entregaController.listarPendentes);
entregaRouter.get("/listarPorMotoboy/:id", entregaController.listarPorMotoboy);
//entregaRouter.post("/searchSellerByName", auth, requestValidator, motoboyController.searchSellerByName);
entregaRouter.post("/novo", entregaController.novo);
entregaRouter.delete("/excluir/:id", entregaController.excluirPendente);
entregaRouter.put("/atualizar", entregaController.atualizarPendente);

module.exports = entregaRouter;