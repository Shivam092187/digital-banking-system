import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Sidebar() {
  const [accounts, setAccounts] = useState([]);
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
      {/* ================= DESKTOP SIDEBAR ================= */}
      <div className="hidden md:flex flex-col w-64 h-screen bg-blue-900 text-white">
        
        <h1 className="font-bold p-4 border-b border-blue-700">
          💳 Digital Bank
        </h1>

        <div className="p-4 space-y-3">
          <h2 className="text-sm font-semibold">Your Accounts</h2>

          {accounts.length === 0 && (
            <p className="text-sm text-gray-300">No accounts found</p>
          )}

          {accounts.map((acc) => (
            <div
              key={acc._id}
              onClick={() => selectAccount(acc._id)}
              className="bg-blue-700 p-2 rounded cursor-pointer break-all"
            >
              {acc._id}
            </div>
          ))}

          <button
            onClick={logout}
            className="bg-red-500 w-full py-2 rounded mt-3"
          >
            Logout
          </button>
        </div>
      </div>

      {/* ================= MOBILE TOPBAR ================= */}
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

        {/* DROPDOWN MENU */}
        {open && (
          <div className="bg-blue-800 p-4 space-y-3">
            
            <h2 className="text-sm font-semibold">Your Accounts</h2>

            {accounts.length === 0 && (
              <p className="text-sm text-gray-300">No accounts found</p>
            )}

            {accounts.map((acc) => (
              <div
                key={acc._id}
                onClick={() => selectAccount(acc._id)}
                className="bg-blue-700 p-2 rounded cursor-pointer break-all"
              >
                {acc._id}
              </div>
            ))}

            <button
              onClick={logout}
              className="bg-red-500 w-full py-2 rounded mt-3"
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