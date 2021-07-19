const express = require("express");
const sellerRouter = require("./sellerRouter");
const saleRouter = require("./saleRouter");
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

router.use("/seller", sellerRouter);
router.use("/sale", saleRouter);

router.use("/cliente", clienteRouter);
router.use("/motoboy", motoboyRouter);
router.use("/entrega", entregaRouter);
router.use("/associado", associadoRouter);
router.use("/login", loginRouter);
router.use("/relatorio", relatorioRouter);

module.exports = router;