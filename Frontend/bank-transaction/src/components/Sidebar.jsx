import { useEffect, useState } from "react";
import axios from "axios";

function Sidebar() {
  const [accounts, setAccounts] = useState([]);
  const [open, setOpen] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    loadAccounts();
  }, []);

  const loadAccounts = async () => {
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

  const selectAccount = (id) => {
    localStorage.setItem("accountId", id);
    window.location.href = "/dashboard";
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

      loadAccounts();
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
      {/* ================= MOBILE TOP BAR ================= */}
      <div className="md:hidden flex justify-between items-center bg-blue-900 text-white p-4">

        <h1 className="font-bold">Digital Bank</h1>

        <button
          onClick={() => setOpen(!open)}
          className="text-3xl"
        >
          ☰
        </button>

      </div>

      {/* ================= MOBILE MENU (FORCE RENDER) ================= */}
      {open && (
        <div className="md:hidden bg-blue-800 text-white p-3 space-y-3">

          <button
            onClick={createAccount}
            className="bg-green-500 w-full py-2 rounded"
          >
            + Create Account
          </button>

          <div className="space-y-2">

            {accounts.length === 0 ? (
              <p className="text-sm text-gray-300">
                No accounts found
              </p>
            ) : (
              accounts.map((acc) => (
                <div
                  key={acc._id}
                  onClick={() => selectAccount(acc._id)}
                  className="bg-blue-700 p-2 rounded text-sm break-all"
                >
                  {acc._id}
                </div>
              ))
            )}

          </div>

          <button
            onClick={logout}
            className="bg-red-500 w-full py-2 rounded"
          >
            Logout
          </button>

        </div>
      )}

      {/* ================= DESKTOP ================= */}
      <div className="hidden md:flex flex-col w-64 h-screen bg-blue-900 text-white fixed">

        <h1 className="font-bold p-4 border-b border-blue-700">
          Digital Bank
        </h1>

        <div className="p-4 space-y-3">

          <button
            onClick={createAccount}
            className="bg-green-500 w-full py-2 rounded"
          >
            + Create Account
          </button>

          {accounts.map((acc) => (
            <div
              key={acc._id}
              onClick={() => selectAccount(acc._id)}
              className="bg-blue-700 p-2 rounded text-sm break-all"
            >
              {acc._id}
            </div>
          ))}

          <button
            onClick={logout}
            className="bg-red-500 w-full py-2 rounded"
          >
            Logout
          </button>

        </div>
      </div>
    </>
  );
}

export default Sidebar;