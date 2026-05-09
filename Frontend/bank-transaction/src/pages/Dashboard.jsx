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

      {/* DESKTOP SIDEBAR ONLY */}
      <Sidebar />

      {/* MAIN CONTENT (NO GAP FIX) */}
      <div className="flex-1 md:ml-64 p-4">

        {/* MOBILE TOP BAR ONLY (NO SIDEBAR) */}
        <div className="md:hidden bg-white p-3 shadow mb-4">
          <h1 className="font-bold">Digital Bank Dashboard</h1>
          <p className="text-sm break-all">{accountId}</p>
        </div>

        {/* BALANCE */}
        <div className="bg-blue-600 text-white p-6 rounded mb-4">
          <h2>Current Balance</h2>
          <h1 className="text-3xl font-bold">₹ {balance}</h1>
        </div>

        {/* ACTIONS */}
        <div className="grid md:grid-cols-2 gap-4 mb-4">
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