import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Sidebar() {

  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);

  const [open, setOpen] = useState(false);

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

  // 🔥 CREATE ACCOUNT FIXED
  const createAccount = async () => {
    try {
      setLoading(true);

      const res = await axios.post(
        "https://digital-banking-system-1.onrender.com/api/accounts",
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      await fetchAccounts();

      const newId = res.data.account?._id;
      if (newId) {
        localStorage.setItem("accountId", newId);
      }

      alert("Account Created");

    } catch (err) {
      console.log(err);
      alert("Failed to create account");
    } finally {
      setLoading(false);
    }
  };

  // 🔥 ACCOUNT SELECT FIXED
  const selectAccount = (id) => {
    localStorage.setItem("accountId", id);
    navigate("/dashboard");
    setOpen(false);
  };

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <>

      {/* 🔥 MOBILE TOP MENU (FIXED - NOW VISIBLE) */}
      <div className="md:hidden bg-blue-900 text-white p-3 flex justify-between items-center">

        <h1 className="font-bold">💳 Bank</h1>

        <button
          onClick={() => setOpen(!open)}
          className="text-2xl"
        >
          ☰
        </button>

      </div>

      {/* 🔥 MOBILE DROPDOWN MENU */}
      <div className={`md:hidden bg-blue-800 text-white p-3 space-y-3 ${open ? "block" : "hidden"}`}>

        {/* CREATE ACCOUNT */}
        <button
          onClick={createAccount}
          className="bg-green-500 w-full py-2 rounded"
        >
          {loading ? "Creating..." : "+ Create Account"}
        </button>

        {/* ACCOUNTS */}
        <div>
          <p className="text-sm mb-2">Accounts</p>

          {accounts.map((acc, i) => (
            <div
              key={acc._id}
              onClick={() => selectAccount(acc._id)}
              className="bg-blue-700 p-2 mb-2 rounded cursor-pointer"
            >
              Account {i + 1}
            </div>
          ))}

        </div>

        {/* LOGOUT */}
        <button
          onClick={logout}
          className="bg-red-500 w-full py-2 rounded"
        >
          Logout
        </button>

      </div>

      {/* 🔥 DESKTOP SIDEBAR */}
      <div className="hidden md:flex flex-col fixed left-0 top-0 h-screen w-64 bg-blue-900 text-white">

        <div className="p-4 border-b border-blue-700">
          <h1 className="text-xl font-bold">💳 Digital Bank</h1>
        </div>

        <div className="flex-1 p-4 overflow-y-auto">

          {/* CREATE ACCOUNT */}
          <button
            onClick={createAccount}
            disabled={loading}
            className="bg-green-500 w-full py-2 rounded mb-4"
          >
            {loading ? "Creating..." : "+ Create Account"}
          </button>

          <h2 className="mb-2">Accounts</h2>

          {/* ACCOUNTS LIST */}
          {accounts.map((acc, i) => (
            <div
              key={acc._id}
              onClick={() => selectAccount(acc._id)}
              className="bg-blue-700 p-2 mb-2 rounded cursor-pointer"
            >
              Account {i + 1}
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

    </>
  );
}

export default Sidebar;