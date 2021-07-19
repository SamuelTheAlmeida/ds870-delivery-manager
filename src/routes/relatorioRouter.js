const express = require("express");
const relatorioRouter = express.Router();
const relatorioController = require("../controllers/relatorioController");
const auth = require("../middlewares/auth");

relatorioRouter.get("/administrativoAssociados", auth, relatorioController.administrativoAssociados);
relatorioRouter.get("/financeiro", auth, relatorioController.financeiro);
relatorioRouter.get("/financeiroMotoboys", auth, relatorioController.financeiroMotoboys);

module.exports = relatorioRouter;