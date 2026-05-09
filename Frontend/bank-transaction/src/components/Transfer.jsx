import { useEffect, useState } from "react";
import axios from "axios";

function Transfer({ accountId, onSuccess }) {

  const [accounts, setAccounts] = useState([]);

  const [toAccount, setToAccount] = useState("");

  const [amount, setAmount] = useState("");

  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");


  /**
   * 🔥 FETCH ALL ACCOUNTS
   */
  const fetchAccounts = async () => {

    try {

      const res = await axios.get(
        "http://localhost:3000/api/accounts/all",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("ALL ACCOUNTS:", res.data);

      setAccounts(res.data.accounts || []);

    } catch (err) {

      console.log(
        err.response?.data || err.message
      );

    }
  };


  useEffect(() => {

    fetchAccounts();

  }, []);


  /**
   * 🔥 HANDLE TRANSFER
   */
  const handleTransfer = async () => {

    try {

      console.log("FROM:", accountId);

      console.log("TO:", toAccount);

      console.log("AMOUNT:", amount);

      // 🔥 VALIDATION
      if (!accountId) {
        return alert("Please select sender account");
      }

      if (!toAccount) {
        return alert("Please select receiver account");
      }

      if (!amount || Number(amount) <= 0) {
        return alert("Please enter valid amount");
      }

      setLoading(true);

      // 🔥 API CALL
      const res = await axios.post(
        "http://localhost:3000/api/transactions",
        {
          fromAccount: accountId,
          toAccount: toAccount,
          amount: Number(amount),
          idempotencyKey: `TXN-${Date.now()}`
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("TRANSFER RESPONSE:", res.data);

      alert(
        res.data.message ||
        "Transfer Successful"
      );

      // 🔥 RESET
      setAmount("");

      setToAccount("");

      // 🔥 REFRESH BALANCE
      if (onSuccess) {
        onSuccess();
      }

    } catch (err) {

      console.log(
        "TRANSFER ERROR:",
        err.response?.data || err.message
      );

      alert(
        err.response?.data?.message ||
        "Transfer failed"
      );

    } finally {

      setLoading(false);

    }
  };


  return (

    <div className="bg-white p-6 rounded-2xl shadow-md">

      {/* TITLE */}
      <h2 className="text-2xl font-bold text-gray-800 mb-5">
        💸 Transfer Money
      </h2>


      {/* SENDER ACCOUNT */}
      <div className="mb-4">

        <p className="text-sm text-gray-500 mb-1">
          Sender Account
        </p>

        <div className="bg-gray-100 p-3 rounded-lg text-sm break-all font-medium text-blue-700">
          {accountId || "No Account Selected"}
        </div>

      </div>


      {/* RECEIVER ACCOUNT */}
      <div className="mb-4">

        <p className="text-sm text-gray-500 mb-1">
          Select Receiver Account
        </p>

        <select
          value={toAccount}
          onChange={(e) => setToAccount(e.target.value)}
          className="w-full border border-gray-300 p-3 rounded-lg outline-none"
        >

          <option value="">
            Select Receiver
          </option>

          {accounts
            .filter((acc) => acc._id !== accountId)
            .map((acc) => (

              <option
                key={acc._id}
                value={acc._id}
              >
                {acc._id}
              </option>

            ))}

        </select>

      </div>


      {/* AMOUNT */}
      <div className="mb-5">

        <p className="text-sm text-gray-500 mb-1">
          Amount
        </p>

        <input
          type="number"
          placeholder="Enter Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full border border-gray-300 p-3 rounded-lg outline-none"
        />

      </div>


      {/* BUTTON */}
      <button
        onClick={handleTransfer}
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 transition text-white py-3 rounded-lg font-semibold"
      >
        {loading
          ? "Processing..."
          : "Transfer Money"}
      </button>

    </div>
  );
}

export default Transfer;