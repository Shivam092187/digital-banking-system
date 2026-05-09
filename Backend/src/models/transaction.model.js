const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    /**
     * 🔥 FROM ACCOUNT
     */
    fromAccount: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "account",
      required: [true, "Transaction must have fromAccount"],
      index: true,
    },

    /**
     * 🔥 TO ACCOUNT
     */
    toAccount: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "account",
      required: [true, "Transaction must have toAccount"],
      index: true,
    },

    /**
     * 🔥 AMOUNT
     */
    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: [1, "Amount must be greater than 0"],
    },

    /**
     * 🔥 STATUS
     */
    status: {
      type: String,
      enum: {
        values: [
          "PENDING",
          "COMPLETED",
          "FAILED",
          "REVERSED"
        ],
        message:
          "Status must be PENDING, COMPLETED, FAILED or REVERSED",
      },
      default: "PENDING",
      index: true,
    },

    /**
     * 🔥 IDEMPOTENCY KEY
     */
    idempotencyKey: {
      type: String,
      required: [true, "Idempotency key required"],
      unique: true,
      index: true,
      trim: true,
    },

    /**
     * 🔥 TRANSACTION TYPE
     */
    type: {
      type: String,
      enum: {
        values: [
          "TRANSFER",
          "DEPOSIT",
          "WITHDRAW"
        ],
        message:
          "Type must be TRANSFER, DEPOSIT or WITHDRAW",
      },
      default: "TRANSFER",
      index: true,
    },

    /**
     * 🔥 OPTIONAL NOTE
     */
    note: {
      type: String,
      default: "",
      trim: true,
      maxlength: [200, "Note cannot exceed 200 characters"],
    },
  },
  {
    timestamps: true,
  }
);


/**
 * 🔥 INDEXES
 */

// FAST ACCOUNT SEARCH
transactionSchema.index({
  fromAccount: 1,
  toAccount: 1,
});

// FAST RECENT TRANSACTION SEARCH
transactionSchema.index({
  createdAt: -1,
});

// FAST FILTERING
transactionSchema.index({
  status: 1,
  type: 1,
});


/**
 * 🔥 MODEL
 */
const transactionModel = mongoose.model(
  "transaction",
  transactionSchema
);

module.exports = transactionModel;