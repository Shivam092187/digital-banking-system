import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import AddFund from "../components/AddFund";
import Transfer from "../components/Transfer";
import TransactionList from "../components/TransactionList";

function Dashboard() {
  const [balance, setBalance] = useState(0);
  const [accountId, setAccountId] = useState(null);

  const token = localStorage.getItem("token");

  // 🔥 FIX: realtime sync accountId
  useEffect(() => {
    const syncAccount = () => {
      const id = localStorage.getItem("accountId");
      setAccountId(id);
    };

    syncAccount();

    window.addEventListener("focus", syncAccount);
    window.addEventListener("storage", syncAccount);

    return () => {
      window.removeEventListener("focus", syncAccount);
      window.removeEventListener("storage", syncAccount);
    };
  }, []);

  const fetchBalance = async (id) => {
    try {
      if (!id) return;

      const res = await axios.get(
        `https://digital-banking-system-1.onrender.com/api/accounts/balance/${id}`,
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
    if (accountId) {
      fetchBalance(accountId);
    }
  }, [accountId]);

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* 🔥 IMPORTANT: Sidebar ALWAYS visible */}
      <Sidebar />

      {/* MAIN CONTENT */}
      <div className="flex-1 md:ml-64 p-4">

        {/* SELECTED ACCOUNT */}
        <div className="bg-white p-3 mb-4 shadow rounded">
          <p className="text-sm text-gray-600">Selected Account:</p>
          <p className="font-bold break-all">
            {accountId || "No Account Selected"}
          </p>
        </div>

        {/* BALANCE */}
        <div className="bg-blue-600 text-white p-6 rounded mb-4">
          <h2>Current Balance</h2>
          <h1 className="text-3xl font-bold">₹ {balance}</h1>
        </div>

        {/* ACTIONS */}
        {accountId ? (
          <>
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <AddFund
                accountId={accountId}
                onSuccess={() => fetchBalance(accountId)}
              />
              <Transfer
                accountId={accountId}
                onSuccess={() => fetchBalance(accountId)}
              />
            </div>

            <TransactionList accountId={accountId} />
          </>
        ) : (
          <p className="text-gray-500">
            Please select an account from sidebar
          </p>
        )}

      </div>
    </div>
  );
}

export default Dashboard;