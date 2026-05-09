import { useState } from "react";
import axios from "axios";

function AddFund({ accountId, onSuccess }) {

  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  /**
   * 🔥 ADD FUND (FIXED)
   */
  const handleAddFund = async () => {
    try {

      if (!accountId) {
        return alert("Please select account");
      }

      if (!amount || Number(amount) <= 0) {
        return alert("Enter valid amount");
      }

      setLoading(true);

      const res = await axios.post(
        "https://digital-banking-system-1.onrender.com/api/transactions/deposit",
        {
          accountId,
          amount: Number(amount),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("DEPOSIT RESPONSE:", res.data);

      alert(res.data.message || "Fund Added Successfully");

      setAmount("");

      if (onSuccess) {
        onSuccess();
      }

    } catch (err) {

      console.log(err.response?.data || err.message);

      alert(
        err.response?.data?.message ||
        "Add fund failed"
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md">

      <h2 className="text-2xl font-bold text-gray-800 mb-5">
        💰 Add Fund
      </h2>

      {/* ACCOUNT */}
      <div className="mb-4">
        <p className="text-sm text-gray-500 mb-1">
          Selected Account
        </p>

        <div className="bg-gray-100 p-3 rounded-lg text-sm break-all font-medium text-blue-700">
          {accountId || "No Account Selected"}
        </div>
      </div>

      {/* INPUT */}
      <input
        type="number"
        placeholder="Enter Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="w-full border border-gray-300 p-3 rounded-lg mb-5 outline-none focus:border-green-500"
      />

      {/* BUTTON */}
      <button
        onClick={handleAddFund}
        disabled={loading}
        className="w-full bg-green-600 hover:bg-green-700 transition text-white py-3 rounded-lg font-semibold"
      >
        {loading ? "Adding Fund..." : "Add Money"}
      </button>

    </div>
  );
}

export default AddFund;