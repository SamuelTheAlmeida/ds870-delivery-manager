const express = require("express");
const relatorioRouter = express.Router();
const relatorioController = require("../controllers/relatorioController");
const auth = require("../middlewares/auth");
const requestValidator = require("../middlewares/schemaValidator")

relatorioRouter.get("/administrativoAssociados", relatorioController.administrativoAssociados);
relatorioRouter.get("/financeiro", relatorioController.financeiro);
relatorioRouter.get("/financeiroMotoboys", relatorioController.financeiroMotoboys);

module.exports = relatorioRouter;