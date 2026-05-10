import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import AddFund from "../components/AddFund";
import Transfer from "../components/Transfer";
import TransactionList from "../components/TransactionList";

function Dashboard() {
  const [balance, setBalance] = useState(0);
  const [accountId, setAccountId] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const id = localStorage.getItem("accountId");
    setAccountId(id);
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
    if (accountId) fetchBalance(accountId);
  }, [accountId]);

  const logout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* 🔥 DESKTOP SIDEBAR (UNCHANGED) */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* MAIN AREA */}
      <div className="flex-1 md:ml-64 p-4">

        {/* 🔥 MOBILE TOP BAR ONLY */}
        <div className="md:hidden flex justify-between items-center bg-blue-900 text-white px-4 py-3">

          <h1 className="font-bold">Dashboard</h1>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-2xl"
          >
            ☰
          </button>

        </div>

        {/* 🔥 MOBILE MENU ONLY */}
        {menuOpen && (
          <div className="md:hidden bg-blue-800 text-white p-3 space-y-3">

            <button
              onClick={logout}
              className="bg-red-500 w-full py-2 rounded"
            >
              Logout
            </button>

            <p className="text-sm break-all">
              Account: {accountId || "Not Selected"}
            </p>

          </div>
        )}

        {/* 🔥 DESKTOP + MOBILE CONTENT SAME (NO CHANGE) */}

        <div className="bg-white p-3 mb-4 shadow rounded">
          <p className="text-sm text-gray-600">Selected Account:</p>
          <p className="font-bold break-all">
            {accountId || "No Account Selected"}
          </p>
        </div>

        <div className="bg-blue-600 text-white p-6 rounded mb-4">
          <h2>Current Balance</h2>
          <h1 className="text-3xl font-bold">₹ {balance}</h1>
        </div>

        {accountId ? (
          <>
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <AddFund accountId={accountId} onSuccess={() => fetchBalance(accountId)} />
              <Transfer accountId={accountId} onSuccess={() => fetchBalance(accountId)} />
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