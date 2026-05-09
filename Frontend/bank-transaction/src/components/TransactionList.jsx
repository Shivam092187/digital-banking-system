import { useEffect, useState } from "react";
import axios from "axios";

function TransactionList() {

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
  const accountId = localStorage.getItem("accountId");

  /**
   * 🔥 FETCH TRANSACTIONS (FIXED)
   */
  const fetchTransactions = async () => {

    try {

      setLoading(true);

      const res = await axios.get(
        "https://digital-banking-system-1.onrender.com/api/transactions",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTransactions(res.data.transactions || []);

    } catch (err) {
      console.log(err.response?.data || err.message);
      setTransactions([]);

    } finally {
      setLoading(false);
    }
  };


  /**
   * 🔥 AUTO REFRESH FIX (ACCOUNT CHANGE SUPPORT)
   */
  useEffect(() => {

    fetchTransactions();

    const handleChange = () => {
      fetchTransactions();
    };

    window.addEventListener("accountChanged", handleChange);

    return () => {
      window.removeEventListener("accountChanged", handleChange);
    };

  }, []);


  return (
    <div className="bg-white p-6 rounded-2xl shadow-md">

      {/* TITLE */}
      <div className="flex items-center justify-between mb-5">

        <h2 className="text-2xl font-bold text-gray-800">
          📜 Transaction History
        </h2>

        <button
          onClick={fetchTransactions}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm"
        >
          Refresh
        </button>

      </div>

      {/* LOADING */}
      {loading && (
        <div className="text-gray-500">
          Loading transactions...
        </div>
      )}

      {/* EMPTY */}
      {!loading && transactions.length === 0 && (
        <div className="bg-gray-100 p-4 rounded-lg text-gray-500">
          No Transactions Found
        </div>
      )}

      {/* LIST */}
      <div className="space-y-4">

        {transactions.map((txn) => {

          const isDebit =
            txn.fromAccount === accountId;

          return (
            <div
              key={txn._id}
              className="border border-gray-200 rounded-xl p-4"
            >

              {/* TOP */}
              <div className="flex items-center justify-between mb-3">

                <div>
                  <p className="font-bold text-gray-800">
                    {txn.type}
                  </p>

                  <p className="text-xs text-gray-500">
                    {new Date(txn.createdAt).toLocaleString()}
                  </p>
                </div>

                <div
                  className={`font-bold text-lg ${
                    isDebit ? "text-red-600" : "text-green-600"
                  }`}
                >
                  {isDebit ? "-" : "+"} ₹{txn.amount}
                </div>

              </div>

              {/* DETAILS */}
              <div className="text-sm space-y-2">

                <div>
                  <span className="font-semibold">From:</span>
                  <p className="break-all text-gray-600">
                    {txn.fromAccount}
                  </p>
                </div>

                <div>
                  <span className="font-semibold">To:</span>
                  <p className="break-all text-gray-600">
                    {txn.toAccount}
                  </p>
                </div>

                <div>
                  <span className="font-semibold">Status:</span>

                  <span
                    className={`ml-2 px-2 py-1 rounded text-xs ${
                      txn.status === "COMPLETED"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {txn.status}
                  </span>

                </div>

              </div>

            </div>
          );
        })}

      </div>

    </div>
  );
}

export default TransactionList;