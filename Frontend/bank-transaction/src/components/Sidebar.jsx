import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Sidebar() {

  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🔥 MOBILE MENU STATE
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
      console.log(err.response?.data || err.message);
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

      alert("Account Created");

    } catch (err) {
      alert(err.response?.data?.message || "Failed");
    } finally {
      setLoading(false);
    }
  };

  const selectAccount = (id) => {
    localStorage.setItem("accountId", id);
    navigate("/dashboard");
    setOpen(false); // 🔥 close mobile menu
  };

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <>
      {/* 🔥 MOBILE TOP MENU BAR */}
      <div className="md:hidden bg-blue-900 text-white p-3 flex items-center">
        <button
          onClick={() => setOpen(true)}
          className="text-2xl"
        >
          ☰
        </button>

        <span className="ml-3 font-bold">
          Digital Bank
        </span>
      </div>

      {/* 🔥 SIDEBAR */}
      <div
        className={`
          fixed md:static top-0 left-0 h-screen bg-blue-900 text-white flex flex-col
          transition-all duration-300 z-50
          ${open ? "w-64" : "w-0 md:w-64 overflow-hidden"}
        `}
      >

        {/* 🔥 CLOSE BUTTON (MOBILE ONLY) */}
        <div className="md:hidden p-3 text-right">
          <button
            onClick={() => setOpen(false)}
            className="text-xl"
          >
            ✕
          </button>
        </div>

        {/* HEADER */}
        <div className="p-5 border-b border-blue-700 hidden md:block">
          <h1 className="text-2xl font-bold">
            💳 Digital Bank
          </h1>
        </div>

        {/* BODY */}
        <div className="flex-1 overflow-y-auto p-4">

          <button
            onClick={createAccount}
            disabled={loading}
            className="bg-green-500 hover:bg-green-600 w-full py-3 rounded-lg mb-5"
          >
            {loading ? "Creating..." : "+ Create Account"}
          </button>

          <h2 className="mb-3 text-sm font-bold">
            Your Accounts
          </h2>

          <div className="space-y-3">

            {accounts.length === 0 && (
              <div className="bg-blue-800 p-3 rounded text-sm">
                No Accounts Found
              </div>
            )}

            {accounts.map((acc, index) => (
              <div
                key={acc._id}
                onClick={() => selectAccount(acc._id)}
                className="bg-blue-700 hover:bg-blue-600 p-3 rounded cursor-pointer"
              >
                <p className="text-xs text-gray-200">
                  Account #{index + 1}
                </p>

                <p className="text-sm break-all">
                  {acc._id}
                </p>
              </div>
            ))}

          </div>
        </div>

        {/* FOOTER */}
        <div className="p-4 border-t border-blue-700">
          <button
            onClick={logout}
            className="bg-red-500 hover:bg-red-600 w-full py-3 rounded"
          >
            Logout
          </button>
        </div>

      </div>
    </>
  );
}

export default Sidebar;