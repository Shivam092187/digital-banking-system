import { useEffect, useState } from "react";
import axios from "axios";

import Sidebar from "../components/Sidebar";
import AddFund from "../components/AddFund";
import Transfer from "../components/Transfer";
import TransactionList from "../components/TransactionList";

function Dashboard() {

  const [balance, setBalance] = useState(0);

  // 🔥 reactive accountId (IMPORTANT FIX)
  const [accountId, setAccountId] = useState(
    localStorage.getItem("accountId")
  );

  const token = localStorage.getItem("token");

  /**
   * 🔥 FETCH BALANCE
   */
  const fetchBalance = async (id = accountId) => {
    try {

      if (!id) {
        setBalance(0);
        return;
      }

      const res = await axios.get(
        `https://digital-banking-system-1.onrender.com/api/accounts/balance/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setBalance(res.data.balance || 0);

    } catch (err) {
      console.log(err.response?.data || err.message);
      setBalance(0);
    }
  };

  /**
   * 🔥 ACCOUNT CHANGE LISTENER (MAIN FIX)
   */
  useEffect(() => {

    const handler = () => {
      const newAccountId = localStorage.getItem("accountId");

      setAccountId(newAccountId);

      fetchBalance(newAccountId);
    };

    window.addEventListener("accountChanged", handler);

    return () => {
      window.removeEventListener("accountChanged", handler);
    };

  }, []);

  /**
   * 🔥 INITIAL LOAD
   */
  useEffect(() => {
    fetchBalance(accountId);
  }, [accountId]);


  return (
    <div className="flex bg-gray-100 min-h-screen">

      {/* SIDEBAR */}
      <Sidebar />

      {/* MAIN */}
      <div className="ml-64 flex-1 p-6">

        {/* HEADER */}
        <div className="bg-white rounded-xl shadow p-5 mb-6">

          <h1 className="text-3xl font-bold text-gray-800">
            Digital Banking Dashboard
          </h1>

          <p className="text-gray-500 mt-2">
            Selected Account:
          </p>

          <p className="font-semibold text-blue-700 break-all">
            {accountId || "No Account Selected"}
          </p>

        </div>

        {/* BALANCE */}
        <div className="bg-blue-600 text-white rounded-xl p-6 shadow mb-6">

          <h2 className="text-lg">
            Current Balance
          </h2>

          <p className="text-4xl font-bold mt-2">
            ₹ {balance}
          </p>

        </div>

        {/* ACTIONS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

          {/* ADD FUND */}
          <AddFund
            accountId={accountId}
            onSuccess={() => fetchBalance(accountId)}
          />

          {/* TRANSFER */}
          <Transfer
            accountId={accountId}
            onSuccess={() => fetchBalance(accountId)}
          />

        </div>

        {/* TRANSACTIONS */}
        <TransactionList />

      </div>
    </div>
  );
}

export default Dashboard;