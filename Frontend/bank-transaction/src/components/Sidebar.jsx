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
    window.location.href = "/dashboard"; // 🔥 FIX
  };

  return (
    <>
      {/* DESKTOP */}
      <div className="hidden md:flex flex-col w-64 h-screen bg-blue-900 text-white fixed">

        <h1 className="p-4 font-bold border-b border-blue-700">
          💳 Digital Bank
        </h1>

        <div className="p-4 space-y-2">
          {accounts.map((acc) => (
            <div
              key={acc._id}
              onClick={() => selectAccount(acc._id)}
              className="bg-blue-700 p-2 rounded cursor-pointer"
            >
              {acc._id}
            </div>
          ))}
        </div>

      </div>

      {/* MOBILE */}
      <div className="md:hidden w-full bg-blue-900 text-white">

        <div className="flex justify-between p-3 border-b border-blue-700">
          <h1>💳 Digital Bank</h1>

          <button onClick={() => setOpen(!open)}>☰</button>
        </div>

        {open && (
          <div className="p-3 space-y-2 bg-blue-800">

            {accounts.map((acc) => (
              <div
                key={acc._id}
                onClick={() => selectAccount(acc._id)}
                className="bg-blue-700 p-2 rounded"
              >
                {acc._id}
              </div>
            ))}

          </div>
        )}

      </div>
    </>
  );
}

export default Sidebar;