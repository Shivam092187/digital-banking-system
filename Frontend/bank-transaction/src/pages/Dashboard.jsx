import { useEffect, useState } from "react";
import axios from "axios";

import Sidebar from "../components/Sidebar";
import AddFund from "../components/AddFund";
import Transfer from "../components/Transfer";
import TransactionList from "../components/TransactionList";

function Dashboard() {

  const [balance, setBalance] = useState(0);

  const accountId = localStorage.getItem("accountId");
  const token = localStorage.getItem("token");

  const fetchBalance = async () => {
    try {
      if (!accountId) return;

      const res = await axios.get(
        `https://digital-banking-system-1.onrender.com/api/accounts/balance/${accountId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setBalance(res.data.balance);

    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchBalance();
  }, [accountId]);

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* SIDEBAR */}
      <Sidebar />

      {/* MAIN CONTENT (NO ml-64 = FIXED GAP ISSUE) */}
      <div className="flex-1 p-4 md:p-6">

        {/* HEADER */}
        <div className="bg-white rounded-xl shadow p-5 mb-6">

          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            Digital Banking Dashboard
          </h1>

          <p className="text-gray-500 mt-2">
            Selected Account:
          </p>

          <p className="font-semibold text-blue-700 break-all">
            {accountId || "No Account Selected"}
          </p>

        </div>

        {/* BALANCE */}
        <div className="bg-blue-600 text-white rounded-xl p-6 shadow mb-6">

          <h2 className="text-lg">Current Balance</h2>

          <p className="text-3xl md:text-4xl font-bold mt-2">
            ₹ {balance}
          </p>

        </div>

        {/* ACTIONS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

          <AddFund accountId={accountId} onSuccess={fetchBalance} />

          <Transfer accountId={accountId} onSuccess={fetchBalance} />

        </div>

        {/* TRANSACTIONS */}
        <TransactionList />

      </div>

    </div>
  );
}

export default Dashboard;