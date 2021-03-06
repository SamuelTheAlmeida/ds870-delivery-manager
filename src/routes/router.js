const express = require("express");
const clienteRouter = require("./clienteRouter");
const motoboyRouter = require("./motoboyRouter");
const entregaRouter = require("./entregaRouter");
const associadoRouter = require("./associadoRouter");
const loginRouter = require("./loginRouter");
const relatorioRouter = require("./relatorioRouter");

const router = express.Router();

router.get("/", (req, res) => {
    res.send("It's working");
});

router.use("/cliente", clienteRouter);
router.use("/motoboy", motoboyRouter);
router.use("/entrega", entregaRouter);
router.use("/associado", associadoRouter);
router.use("/login", loginRouter);
router.use("/relatorio", relatorioRouter);

module.exports = router;