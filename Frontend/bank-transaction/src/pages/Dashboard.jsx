import { useEffect, useState } from "react";
import axios from "axios";

import Sidebar from "../components/Sidebar";
import AddFund from "../components/AddFund";
import Transfer from "../components/Transfer";
import TransactionList from "../components/TransactionList";

function Dashboard() {

  const [balance, setBalance] = useState(0);
  const [accountId, setAccountId] = useState(localStorage.getItem("accountId"));
  const [open, setOpen] = useState(false);

  const token = localStorage.getItem("token");

  const fetchBalance = async (id = accountId) => {
    try {
      if (!id) return setBalance(0);

      const res = await axios.get(
        `https://digital-banking-system-1.onrender.com/api/accounts/balance/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setBalance(res.data.balance || 0);

    } catch (err) {
      setBalance(0);
    }
  };

  useEffect(() => {

    const handler = () => {
      const id = localStorage.getItem("accountId");
      setAccountId(id);
      fetchBalance(id);
    };

    window.addEventListener("accountChanged", handler);

    return () => window.removeEventListener("accountChanged", handler);

  }, []);

  useEffect(() => {
    fetchBalance(accountId);
  }, [accountId]);

  return (
    <div className="flex bg-gray-100 min-h-screen">

      {/* SIDEBAR */}
      <Sidebar open={open} setOpen={setOpen} />

      {/* MAIN CONTENT (🔥 NO GAP FIX FINAL) */}
      <div className="flex-1 p-6 md:ml-64">

        {/* MOBILE MENU */}
        <button
          className="md:hidden bg-blue-600 text-white px-3 py-2 rounded mb-4"
          onClick={() => setOpen(true)}
        >
          ☰ Menu
        </button>

        {/* HEADER */}
        <div className="bg-white p-5 rounded shadow mb-6">
          <h1 className="text-2xl font-bold">
            Digital Banking Dashboard
          </h1>

          <p className="text-blue-700 break-all mt-2">
            {accountId || "No Account Selected"}
          </p>
        </div>

        {/* BALANCE */}
        <div className="bg-blue-600 text-white p-6 rounded mb-6">
          <h2>Current Balance</h2>
          <p className="text-4xl font-bold">₹ {balance}</p>
        </div>

        {/* ACTIONS */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">

          <AddFund accountId={accountId} onSuccess={() => fetchBalance(accountId)} />

          <Transfer accountId={accountId} onSuccess={() => fetchBalance(accountId)} />

        </div>

        <TransactionList />

      </div>
    </div>
  );
}

export default Dashboard;