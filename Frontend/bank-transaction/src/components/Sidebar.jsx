import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Sidebar({ open, setOpen }) {

  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);

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
      console.log(err.message);
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
        { headers: { Authorization: `Bearer ${token}` } }
      );

      await fetchAccounts();

      if (res.data.account?._id) {
        localStorage.setItem("accountId", res.data.account._id);
        window.dispatchEvent(new Event("accountChanged"));
      }

      alert("Account Created");

    } catch (err) {
      alert("Failed");
    } finally {
      setLoading(false);
    }
  };

  const selectAccount = (id) => {
    localStorage.setItem("accountId", id);
    window.dispatchEvent(new Event("accountChanged"));
    navigate("/dashboard");
    setOpen(false);
  };

  return (
    <>
      {/* OVERLAY */}
      {open && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 md:hidden z-40"
          onClick={() => setOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <div
        className={`
          fixed top-0 left-0 w-64 h-screen bg-blue-900 text-white flex flex-col z-50
          transform transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 md:static md:flex
        `}
      >

        {/* HEADER */}
        <div className="p-5 border-b border-blue-700">
          <h1 className="text-2xl font-bold">💳 Digital Bank</h1>
        </div>

        {/* BODY */}
        <div className="flex-1 overflow-y-auto p-4">

          <button
            onClick={createAccount}
            disabled={loading}
            className="bg-green-500 w-full py-3 rounded mb-5"
          >
            {loading ? "Creating..." : "+ Create Account"}
          </button>

          <div className="space-y-3">

            {accounts.map((acc, i) => (
              <div
                key={acc._id}
                onClick={() => selectAccount(acc._id)}
                className="bg-blue-700 p-3 rounded cursor-pointer"
              >
                <p className="text-xs">Account #{i + 1}</p>
                <p className="break-all text-sm">{acc._id}</p>
              </div>
            ))}

          </div>
        </div>

      </div>
    </>
  );
}

export default Sidebar;