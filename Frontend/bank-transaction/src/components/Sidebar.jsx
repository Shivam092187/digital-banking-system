import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Sidebar() {

  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  /**
   * 🔥 FETCH ACCOUNTS
   */
  const fetchAccounts = async () => {
    try {
      const res = await axios.get(
        "https://digital-banking-system-1.onrender.com/api/accounts",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
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

  /**
   * 🔥 CREATE ACCOUNT
   */
  const createAccount = async () => {
    try {
      setLoading(true);

      const res = await axios.post(
        "https://digital-banking-system-1.onrender.com/api/accounts",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      await fetchAccounts();

      if (res.data.account?._id) {
        localStorage.setItem("accountId", res.data.account._id);

        // 🔥 trigger dashboard update
        window.dispatchEvent(new Event("accountChanged"));
      }

      alert("Account Created Successfully");

    } catch (err) {
      console.log(err.response?.data || err.message);
      alert(err.response?.data?.message || "Account creation failed");

    } finally {
      setLoading(false);
    }
  };

  /**
   * 🔥 SELECT ACCOUNT (FIXED)
   */
  const selectAccount = (id) => {
    localStorage.setItem("accountId", id);

    // 🔥 IMPORTANT: notify dashboard
    window.dispatchEvent(new Event("accountChanged"));

    navigate("/dashboard");
  };

  /**
   * 🔥 LOGOUT
   */
  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="w-64 h-screen fixed left-0 top-0 bg-blue-900 text-white flex flex-col">

      {/* HEADER */}
      <div className="p-5 border-b border-blue-700">
        <h1 className="text-2xl font-bold">
          💳 Digital Bank
        </h1>
      </div>

      {/* BODY */}
      <div className="flex-1 overflow-y-auto p-4">

        <button
          onClick={createAccount}
          disabled={loading}
          className="bg-green-500 hover:bg-green-600 w-full py-3 rounded-lg mb-5 font-semibold"
        >
          {loading ? "Creating..." : "+ Create Account"}
        </button>

        <h2 className="mb-3 text-sm font-bold text-gray-200">
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
              className="bg-blue-700 hover:bg-blue-600 transition p-3 rounded-lg cursor-pointer"
            >
              <p className="text-xs text-gray-200">
                Account #{index + 1}
              </p>

              <p className="font-semibold text-sm break-all">
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
          className="bg-red-500 hover:bg-red-600 w-full py-3 rounded-lg font-semibold"
        >
          Logout
        </button>
      </div>

    </div>
  );
}

export default Sidebar;