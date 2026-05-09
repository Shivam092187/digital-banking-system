const accountModel = require("../models/account.model");

/**
 * 🔥 CREATE NEW ACCOUNT
 */
async function createAccountController(req, res) {

    try {

        // 🔥 ALWAYS CREATE NEW ACCOUNT
        const account = await accountModel.create({
            user: req.user._id
        });

        return res.status(201).json({
            success: true,
            message: "Account created successfully",
            account
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Failed to create account"
        });

    }
}


/**
 * 🔥 GET USER ACCOUNTS
 */
async function getUserAccountsController(req, res) {

    try {

        const accounts = await accountModel.find({
            user: req.user._id
        });

        return res.status(200).json({
            success: true,
            accounts
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch accounts"
        });

    }
}


/**
 * 🔥 GET ALL ACCOUNTS
 */
async function getAllAccountsController(req, res) {

    try {

        const accounts = await accountModel
            .find()
            .populate("user", "name email");

        return res.status(200).json({
            success: true,
            accounts
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch accounts"
        });

    }
}


/**
 * 🔥 GET ACCOUNT BALANCE
 */
async function getAccountBalanceController(req, res) {

    try {

        const { accountId } = req.params;

        const account = await accountModel.findOne({
            _id: accountId,
            user: req.user._id
        });

        if (!account) {

            return res.status(404).json({
                success: false,
                message: "Account not found"
            });

        }

        const balance = await account.getBalance();

        return res.status(200).json({
            success: true,
            accountId: account._id,
            balance
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch balance"
        });

    }
}

module.exports = {
    createAccountController,
    getUserAccountsController,
    getAllAccountsController,
    getAccountBalanceController
};