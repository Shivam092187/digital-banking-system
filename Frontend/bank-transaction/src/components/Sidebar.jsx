import { useEffect, useState } from "react";
import axios from "axios";

function Sidebar() {
  const [accounts, setAccounts] = useState([]);
  const [open, setOpen] = useState(false);

  const token = localStorage.getItem("token");

  const fetchAccounts = async () => {
    try {
      const res = await axios.get(
        "https://digital-banking-system-1.onrender.com/api/accounts",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("ACCOUNTS:", res.data.accounts); // 🔥 DEBUG IMPORTANT
      setAccounts([...res.data.accounts]); // 🔥 force fresh copy
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const selectAccount = (id) => {
    localStorage.setItem("accountId", id);
    window.location.href = "/dashboard";
  };

  const logout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  const createAccount = async () => {
    try {
      await axios.post(
        "https://digital-banking-system-1.onrender.com/api/accounts/create",
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      await fetchAccounts(); // 🔥 ensure refresh complete
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      {/* ================= DESKTOP ================= */}
      <div className="hidden md:flex flex-col w-64 h-screen bg-blue-900 text-white fixed left-0 top-0">

        <h1 className="font-bold p-4 border-b border-blue-700">
          💳 Digital Bank
        </h1>

        <div className="p-4 space-y-3">

          <button
            onClick={createAccount}
            className="bg-green-500 w-full py-2 rounded"
          >
            + Create Account
          </button>

          <div className="space-y-2 max-h-[60vh] overflow-y-auto">

            {accounts.map((acc, index) => (
              <div
                key={acc._id || index}
                onClick={() => selectAccount(acc._id)}
                className="bg-blue-700 p-2 rounded cursor-pointer text-sm break-words"
              >
                {acc._id}
              </div>
            ))}

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

        <div className="flex justify-between items-center px-4 py-3 border-b border-blue-700">

          <h1 className="font-bold">💳 Digital Bank</h1>

          <button
            onClick={() => setOpen(!open)}
            className="text-2xl"
          >
            ☰
          </button>

        </div>

        {/* 🔥 IMPORTANT FIX HERE */}
        {open && (
          <div className="bg-blue-800 p-3 space-y-2 max-h-80 overflow-y-auto">

            <button
              onClick={createAccount}
              className="bg-green-500 w-full py-1 rounded"
            >
              + Create Account
            </button>

            {accounts.map((acc, index) => (
              <div
                key={acc._id || index}
                onClick={() => selectAccount(acc._id)}
                className="bg-blue-700 p-2 rounded text-sm break-words cursor-pointer"
              >
                {acc._id}
              </div>
            ))}

            <button
              onClick={logout}
              className="bg-red-500 w-full py-1 rounded"
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