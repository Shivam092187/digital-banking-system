const transactionModel = require("../models/transaction.model");
const ledgerModel = require("../models/ledger.model");
const accountModel = require("../models/account.model");
const mongoose = require("mongoose");


/**
 * 🔥 TRANSFER MONEY
 */
async function createTransaction(req, res) {

  let session;

  try {

    const {
      fromAccount,
      toAccount,
      amount,
      idempotencyKey
    } = req.body;

    // 🔥 VALIDATION
    if (
      !fromAccount ||
      !toAccount ||
      !amount ||
      !idempotencyKey
    ) {

      return res.status(400).json({
        success: false,
        message: "All fields required"
      });

    }

    // 🔥 CHECK ACCOUNTS
    const sender = await accountModel.findById(fromAccount);

    const receiver = await accountModel.findById(toAccount);

    if (!sender || !receiver) {

      return res.status(404).json({
        success: false,
        message: "Account not found"
      });

    }

    // 🔥 CHECK BALANCE
    const balance = await sender.getBalance();

    if (balance < amount) {

      return res.status(400).json({
        success: false,
        message: "Insufficient balance"
      });

    }

    // 🔥 START SESSION
    session = await mongoose.startSession();

    session.startTransaction();

    // 🔥 CREATE TRANSACTION
    const txn = (await transactionModel.create(
      [{
        fromAccount,
        toAccount,
        amount,
        idempotencyKey,
        status: "COMPLETED"
      }],
      { session }
    ))[0];

    // 🔥 DEBIT ENTRY
    await ledgerModel.create(
      [{
        account: fromAccount,
        amount,
        transaction: txn._id,
        type: "DEBIT"
      }],
      { session }
    );

    // 🔥 CREDIT ENTRY
    await ledgerModel.create(
      [{
        account: toAccount,
        amount,
        transaction: txn._id,
        type: "CREDIT"
      }],
      { session }
    );

    await session.commitTransaction();

    session.endSession();

    return res.status(201).json({
      success: true,
      message: "Transaction success",
      transaction: txn
    });

  } catch (err) {

    if (session) {

      await session.abortTransaction();

      session.endSession();

    }

    console.log(err);

    return res.status(500).json({
      success: false,
      message: "Transaction failed",
      error: err.message
    });

  }
}


/**
 * 🔥 ADD FUND
 */
async function depositController(req, res) {

  try {

    const { accountId, amount } = req.body;

    if (!accountId || !amount) {

      return res.status(400).json({
        success: false,
        message: "Required fields missing"
      });

    }

    // 🔥 CHECK ACCOUNT
    const account = await accountModel.findById(accountId);

    if (!account) {

      return res.status(404).json({
        success: false,
        message: "Account not found"
      });

    }

    // 🔥 CREATE TRANSACTION
    const txn = await transactionModel.create({
      fromAccount: accountId,
      toAccount: accountId,
      amount,
      idempotencyKey: `DEP-${Date.now()}`,
      status: "COMPLETED"
    });

    // 🔥 CREDIT LEDGER
    await ledgerModel.create({
      account: accountId,
      amount,
      transaction: txn._id,
      type: "CREDIT"
    });

    // 🔥 UPDATED BALANCE
    const balance = await account.getBalance();

    return res.status(200).json({
      success: true,
      message: "Deposit success",
      balance,
      transaction: txn
    });

  } catch (err) {

    console.log(err);

    return res.status(500).json({
      success: false,
      message: "Deposit failed",
      error: err.message
    });

  }
}


/**
 * 🔥 GET TRANSACTIONS
 */
async function getTransactionsController(req, res) {

  try {

    const accounts = await accountModel.find({
      user: req.user._id
    });

    const accountIds = accounts.map(acc => acc._id);

    const transactions = await transactionModel.find({
      $or: [
        { fromAccount: { $in: accountIds } },
        { toAccount: { $in: accountIds } }
      ]
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      transactions
    });

  } catch (err) {

    console.log(err);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch transactions"
    });

  }
}


module.exports = {
  createTransaction,
  depositController,
  getTransactionsController
};