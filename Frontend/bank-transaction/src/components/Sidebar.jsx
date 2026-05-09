import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Sidebar() {

  const [accounts, setAccounts] = useState([]);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

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

  const selectAccount = (id) => {
    localStorage.setItem("accountId", id);
    navigate("/dashboard");
  };

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="hidden md:flex flex-col fixed left-0 top-0 h-screen w-64 bg-blue-900 text-white">

      {/* HEADER */}
      <div className="p-4 border-b border-blue-700">
        <h1 className="text-xl font-bold">💳 Digital Bank</h1>
      </div>

      {/* ACCOUNTS */}
      <div className="flex-1 p-4 overflow-y-auto">

        <h2 className="mb-3 font-semibold">Your Accounts</h2>

        {accounts.map((acc, i) => (
          <div
            key={acc._id}
            onClick={() => selectAccount(acc._id)}
            className="bg-blue-700 p-3 mb-2 rounded cursor-pointer"
          >
            {/* 🔥 REAL ACCOUNT ID SHOW */}
            <p className="text-xs break-all">
              {acc._id}
            </p>
          </div>
        ))}

      </div>

      {/* LOGOUT */}
      <div className="p-4 border-t border-blue-700">
        <button
          onClick={logout}
          className="bg-red-500 w-full py-2 rounded"
        >
          Logout
        </button>
      </div>

    </div>
  );
}

export default Sidebar;