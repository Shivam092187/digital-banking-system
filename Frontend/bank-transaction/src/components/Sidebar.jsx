import { useEffect, useState } from "react";
import axios from "axios";

function Sidebar() {
  const [accounts, setAccounts] = useState([]);
  const [open, setOpen] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get("https://digital-banking-system-1.onrender.com/api/accounts", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setAccounts(res.data.accounts || []))
      .catch((err) => console.log(err));
  }, []);

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

  const logout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <div className="w-full">

      {/* 🔥 MOBILE TOP BAR (ALWAYS VISIBLE) */}
      <div className="md:hidden flex justify-between items-center bg-blue-900 text-white p-4">

        <h1 className="font-bold">Digital Bank</h1>

        <button
          onClick={() => setOpen(!open)}
          className="text-3xl"
        >
          ☰
        </button>

      </div>

      {/* 🔥 MOBILE MENU */}
      {open && (
        <div className="md:hidden bg-blue-800 text-white p-3 space-y-3">

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
      )}

      {/* 🔥 DESKTOP SIDEBAR */}
      <div className="hidden md:block w-64 h-screen bg-blue-900 text-white fixed left-0 top-0">

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

    </div>
  );
}

export default Sidebar;