const express = require("express");
const motoboyRouter = express.Router();
const motoboyController = require("../controllers/motoboyController");
const auth = require("../middlewares/auth");

motoboyRouter.get("/listar", auth, motoboyController.listarTodos);
motoboyRouter.post("/buscarPorCPF", auth, motoboyController.buscarPorCPF);
motoboyRouter.post("/novo", auth, motoboyController.novo);
motoboyRouter.delete("/excluir/:id", auth, motoboyController.excluir);
motoboyRouter.put("/atualizar", auth, motoboyController.atualizar);

module.exports = motoboyRouter;