import { useEffect, useState } from "react";
import axios from "axios";

function Sidebar() {
  const [accounts, setAccounts] = useState([]);
  const [open, setOpen] = useState(false);

  const token = localStorage.getItem("token");

  // 🔥 FETCH ACCOUNTS (FIXED)
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

  useEffect(() => {
    fetchAccounts();
  }, []);

  // 🔥 SELECT ACCOUNT FIX
  const selectAccount = (id) => {
    localStorage.setItem("accountId", id);
    window.location.href = "/dashboard";
  };

  // 🔥 CREATE ACCOUNT FIX
  const createAccount = async () => {
    try {
      await axios.post(
        "https://digital-banking-system-1.onrender.com/api/accounts/create",
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      fetchAccounts(); // refresh list immediately
    } catch (err) {
      console.log(err);
    }
  };

  const logout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <>
      {/* ================= DESKTOP ================= */}
      <div className="hidden md:flex flex-col w-64 h-screen bg-blue-900 text-white fixed left-0 top-0">

        <h1 className="font-bold p-4 border-b border-blue-700">
          💳 Digital Bank
        </h1>

        <div className="p-4 space-y-3">

          {/* CREATE BUTTON */}
          <button
            onClick={createAccount}
            className="bg-green-500 w-full py-2 rounded"
          >
            + Create Account
          </button>

          {/* ACCOUNT LIST */}
          <div className="space-y-2 max-h-[65vh] overflow-y-auto">

            {accounts.length === 0 ? (
              <p className="text-sm text-gray-300">
                No accounts found
              </p>
            ) : (
              accounts.map((acc) => (
                <div
                  key={acc._id}
                  onClick={() => selectAccount(acc._id)}
                  className="bg-blue-700 p-2 rounded cursor-pointer text-sm break-all"
                >
                  {acc._id}
                </div>
              ))
            )}

          </div>

          <button
            onClick={logout}
            className="bg-red-500 w-full py-2 rounded mt-3"
          >
            Logout
          </button>

        </div>
      </div>

      {/* ================= MOBILE ================= */}
      <div className="md:hidden w-full bg-blue-900 text-white">

        {/* TOP BAR */}
        <div className="flex justify-between items-center px-4 py-3 border-b border-blue-700">

          <h1 className="font-bold">💳 Digital Bank</h1>

          <button
            onClick={() => setOpen(!open)}
            className="text-2xl"
          >
            ☰
          </button>

        </div>

        {/* DROPDOWN */}
        {open && (
          <div className="bg-blue-800 p-3 space-y-3 max-h-[75vh] overflow-y-auto">

            {/* CREATE ACCOUNT */}
            <button
              onClick={createAccount}
              className="bg-green-500 w-full py-2 rounded"
            >
              + Create Account
            </button>

            {/* ACCOUNT LIST */}
            {accounts.length === 0 ? (
              <p className="text-sm text-gray-300">
                No accounts found
              </p>
            ) : (
              accounts.map((acc) => (
                <div
                  key={acc._id}
                  onClick={() => selectAccount(acc._id)}
                  className="bg-blue-700 p-2 rounded cursor-pointer text-sm break-all"
                >
                  {acc._id}
                </div>
              ))
            )}

            {/* LOGOUT */}
            <button
              onClick={logout}
              className="bg-red-500 w-full py-2 rounded"
            >
              Logout
            </button>

          </div>
        )}

      </div>
    </>
  );
}

export default Sidebar;