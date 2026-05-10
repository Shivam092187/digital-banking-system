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

  // 🔥 IMPROVED SYNC (FIXED)
  useEffect(() => {
    const syncAccount = () => {
      const id = localStorage.getItem("accountId");
      setAccountId(id);
    };

    syncAccount();

    // 🔥 FIX: also listen focus (same tab issue fix)
    window.addEventListener("focus", syncAccount);

    return () => {
      window.removeEventListener("focus", syncAccount);
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

  const logout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* DESKTOP SIDEBAR */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* MAIN */}
      <div className="flex-1 md:ml-64 ml-0 p-4">

        {/* TOP BAR */}
        <div className="flex justify-between items-center bg-white p-3 shadow mb-4">

          <h1 className="font-bold">Dashboard</h1>

          <button
            className="md:hidden text-2xl"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            ☰
          </button>

        </div>

        {/* MOBILE MENU */}
        {menuOpen && (
          <div className="md:hidden bg-blue-900 text-white p-3 space-y-2 rounded mb-4">

            <p className="text-sm break-all">
              Account: {accountId || "Not Selected"}
            </p>

            <button
              onClick={logout}
              className="bg-red-500 w-full py-1 rounded"
            >
              Logout
            </button>

          </div>
        )}

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