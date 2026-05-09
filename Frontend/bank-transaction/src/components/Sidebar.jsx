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
      {/* MOBILE TOP BAR */}
      <div className="md:hidden bg-blue-900 text-white p-3 flex justify-between">
        <h1 className="font-bold">💳 Bank</h1>
        <button onClick={() => setOpen(!open)}>☰</button>
      </div>

      {/* SIDEBAR */}
      <div
        className={`
          fixed md:static top-0 left-0 h-screen bg-blue-900 text-white flex flex-col
          transition-all duration-300 z-50
          ${open ? "w-64" : "w-0 md:w-64 overflow-hidden"}
        `}
      >

        {/* BODY */}
        <div className="flex-1 p-4 overflow-y-auto">

          <h2 className="mb-3 font-bold">Accounts</h2>

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

        {/* FOOTER */}
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