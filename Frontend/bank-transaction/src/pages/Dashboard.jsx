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
          headers: { Authorization: `Bearer ${token}` },
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

      {/* ================= SIDEBAR ================= */}
      <Sidebar />

      {/* ================= MAIN CONTENT ================= */}
      <div className="flex-1 p-4 md:ml-64">

        {/* 🔥 MOBILE HEADER (only mobile) */}
        <div className="md:hidden bg-white p-3 shadow mb-4 rounded">
          <h1 className="font-bold text-lg">Digital Bank Dashboard</h1>
          <p className="text-xs break-all text-gray-600">
            {accountId || "No Account Selected"}
          </p>
        </div>

        {/* ================= BALANCE CARD ================= */}
        <div className="bg-blue-600 text-white p-6 rounded-lg mb-4 shadow">
          <h2 className="text-sm">Current Balance</h2>
          <h1 className="text-3xl font-bold">₹ {balance}</h1>
        </div>

        {/* ================= ACTIONS ================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <AddFund accountId={accountId} onSuccess={fetchBalance} />
          <Transfer accountId={accountId} onSuccess={fetchBalance} />
        </div>

        {/* ================= TRANSACTIONS ================= */}
        <div className="bg-white p-4 rounded shadow">
          <TransactionList />
        </div>

      </div>
    </div>
  );
}

export default Dashboard;