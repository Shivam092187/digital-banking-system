import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import AddFund from "../components/AddFund";
import Transfer from "../components/Transfer";
import TransactionList from "../components/TransactionList";

function Dashboard() {
  const [balance, setBalance] = useState(0);
  const [accountId, setAccountId] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);

  const token = localStorage.getItem("token");

  // 🔥 FETCH ACCOUNTS
  const fetchAccounts = async () => {
    try {
      const res = await axios.get(
        "https://digital-banking-system-1.onrender.com/api/accounts",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setAccounts(res.data.accounts || []);
    } catch (err) {
      console.log(err);
    }
  };

  // 🔥 LOAD INITIAL DATA
  useEffect(() => {
    const id = localStorage.getItem("accountId");
    setAccountId(id);

    fetchAccounts();
  }, []);

  // 🔥 FETCH BALANCE
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

  // 🔥 CREATE ACCOUNT (FIXED REAL API)
  const createAccount = async () => {
    try {
      await axios.post(
        "https://digital-banking-system-1.onrender.com/api/accounts/create",
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      fetchAccounts(); // refresh list
    } catch (err) {
      console.log(err);
    }
  };

  // 🔥 SELECT ACCOUNT
  const selectAccount = (id) => {
    localStorage.setItem("accountId", id);
    setAccountId(id);
    setMenuOpen(false);
  };

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

      {/* MAIN CONTENT */}
      <div className="flex-1 md:ml-64 p-4">

        {/* 🔥 TOP BAR (MOBILE ONLY) */}
        <div className="md:hidden flex justify-between items-center bg-blue-900 text-white px-4 py-3">

          <h1 className="font-bold">Dashboard</h1>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-2xl"
          >
            ☰
          </button>

        </div>

        {/* 🔥 MOBILE MENU */}
        {menuOpen && (
          <div className="md:hidden bg-blue-800 text-white p-3 space-y-3">

            {/* CREATE ACCOUNT */}
            <button
              onClick={createAccount}
              className="bg-green-500 w-full py-2 rounded"
            >
              + Create Account
            </button>

            {/* ACCOUNT LIST */}
            <div className="space-y-2">

              {accounts.length === 0 ? (
                <p className="text-sm text-gray-300">
                  No Accounts Found
                </p>
              ) : (
                accounts.map((acc) => (
                  <div
                    key={acc._id}
                    onClick={() => selectAccount(acc._id)}
                    className="bg-blue-700 p-2 rounded text-sm break-all cursor-pointer"
                  >
                    {acc._id}
                  </div>
                ))
              )}

            </div>

            {/* LOGOUT */}
            <button
              onClick={logout}
              className="bg-red-500 w-full py-2 rounded"
            >
              Logout
            </button>

          </div>
        )}

        {/* 🔥 BALANCE */}
        <div className="bg-blue-600 text-white p-6 rounded mb-4">
          <h2>Current Balance</h2>
          <h1 className="text-3xl font-bold">₹ {balance}</h1>
        </div>

        {/* 🔥 ACTIONS */}
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
            Please select an account
          </p>
        )}

      </div>
    </div>
  );
}

export default Dashboard;