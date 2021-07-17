const express = require("express");
const sellerRouter = express.Router();
const sellerController = require("../controllers/sellerController");
const auth = require("../middlewares/auth");
const requestValidator = require("../middlewares/schemaValidator")

sellerRouter.post("/authentication", requestValidator, sellerController.authentication);

sellerRouter.get("/listAllSellers", auth, sellerController.listAllSellers);
sellerRouter.post("/searchSellerByName", auth, requestValidator, sellerController.searchSellerByName);
sellerRouter.post("/newSeller", auth, requestValidator, sellerController.newSeller);
sellerRouter.delete("/deleteSeller/:id", auth, requestValidator, sellerController.deleteSeller);
sellerRouter.put("/updateSeller", auth, requestValidator, sellerController.updateSeller);

module.exports = sellerRouter;