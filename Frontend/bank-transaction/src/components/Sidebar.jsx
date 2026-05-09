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

      if (res.data.account?._id) {
        localStorage.setItem("accountId", res.data.account._id);
      }

    } catch (err) {
      alert("Failed");
    } finally {
      setLoading(false);
    }
  };

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

      {/* 🔥 MOBILE TOP BAR (NO SIDEBAR SPACE) */}
      <div className="md:hidden bg-blue-900 text-white p-3 flex justify-between items-center">

        <h1 className="font-bold">💳 Bank</h1>

        <button
          onClick={() => setOpen(!open)}
          className="text-2xl"
        >
          ☰
        </button>

      </div>

      {/* 🔥 MOBILE MENU (DROPDOWN ONLY) */}
      <div className={`md:hidden bg-blue-800 text-white p-3 space-y-3 ${open ? "block" : "hidden"}`}>

        <button
          onClick={createAccount}
          className="bg-green-500 w-full py-2 rounded"
        >
          {loading ? "Creating..." : "+ Create Account"}
        </button>

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

        <button
          onClick={logout}
          className="bg-red-500 w-full py-2 rounded"
        >
          Logout
        </button>

      </div>

      {/* 🔥 DESKTOP SIDEBAR (NO CHANGE) */}
      <div className="hidden md:flex flex-col fixed left-0 top-0 h-screen w-64 bg-blue-900 text-white">

        <div className="p-4 border-b border-blue-700">
          <h1 className="text-xl font-bold">💳 Digital Bank</h1>
        </div>

        <div className="flex-1 p-4 overflow-y-auto">

          <button
            onClick={createAccount}
            disabled={loading}
            className="bg-green-500 w-full py-2 rounded mb-4"
          >
            {loading ? "Creating..." : "+ Create Account"}
          </button>

          <h2 className="mb-2 text-sm">Accounts</h2>

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