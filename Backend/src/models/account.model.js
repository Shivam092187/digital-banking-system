const mongoose = require("mongoose");

const ledgerModel = require("./ledger.model");

const accountSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,

      // 🔥 FIXED
      ref: "User",

      required: true,

      index: true,
    },

    status: {
      type: String,

      enum: ["ACTIVE", "FROZEN", "CLOSED"],

      default: "ACTIVE",
    },

    currency: {
      type: String,

      default: "INR",
    },
  },
  {
    timestamps: true,
  }
);


/**
 * 🔥 GET BALANCE
 */
accountSchema.methods.getBalance = async function () {

  const result = await ledgerModel.aggregate([
    {
      $match: {
        account: this._id,
      },
    },

    {
      $group: {
        _id: null,

        balance: {
          $sum: {
            $cond: [
              { $eq: ["$type", "CREDIT"] },

              "$amount",

              {
                $multiply: ["$amount", -1],
              },
            ],
          },
        },
      },
    },
  ]);

  return result.length
    ? result[0].balance
    : 0;
};

const accountModel = mongoose.model(
  "account",
  accountSchema
);

module.exports = accountModel;