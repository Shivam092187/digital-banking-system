const express = require("express");

const authMiddleware = require("../middleware/auth.middleware");

const accountController = require("../controllers/account.controller");

const router = express.Router();



/**
 * - POST /api/accounts/
 * - Create New Account
 */
router.post(
  "/",
  authMiddleware.authMiddleware,
  accountController.createAccountController
);



/**
 * - GET /api/accounts/
 * - Get Logged-in User Accounts
 */
router.get(
  "/",
  authMiddleware.authMiddleware,
  accountController.getUserAccountsController
);



/**
 * - GET /api/accounts/all
 * - Get All Accounts
 * - Used For Transfer
 */
router.get(
  "/all",
  authMiddleware.authMiddleware,
  accountController.getAllAccountsController
);



/**
 * - GET /api/accounts/balance/:accountId
 * - Get Account Balance
 */
router.get(
  "/balance/:accountId",
  authMiddleware.authMiddleware,
  accountController.getAccountBalanceController
);



module.exports = router;