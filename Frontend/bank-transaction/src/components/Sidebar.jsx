import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Sidebar() {

  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🔥 SIMPLE MENU STATE
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

      alert("Account Created");
      setOpen(false);

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
    <div className="bg-blue-900 text-white">

      {/* 🔥 TOP BAR */}
      <div className="flex items-center justify-between p-3 md:hidden">

        <h1 className="font-bold">💳 Bank</h1>

        <button
          onClick={() => setOpen(!open)}
          className="text-2xl"
        >
          ☰
        </button>

      </div>

      {/* 🔥 SIMPLE DROPDOWN MENU (NO SIDE SPACE) */}
      {open && (
        <div className="bg-blue-800 p-3 space-y-3 md:hidden">

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
      )}

    </div>
  );
}

export default Sidebar;