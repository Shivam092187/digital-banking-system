const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");

const transactionController = require("../controllers/transaction.controller");


router.post(
  "/deposit",
  authMiddleware.authMiddleware,
  transactionController.depositController
);

router.post(
  "/",
  authMiddleware.authMiddleware,
  transactionController.createTransaction
);

router.get(
  "/",
  authMiddleware.authMiddleware,
  transactionController.getTransactionsController
);

module.exports = router;