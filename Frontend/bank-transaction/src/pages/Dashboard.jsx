import { useEffect, useState } from "react";
import axios from "axios";

import Sidebar from "../components/Sidebar";
import AddFund from "../components/AddFund";
import Transfer from "../components/Transfer";
import TransactionList from "../components/TransactionList";

function Dashboard() {

  const [balance, setBalance] = useState(0);

  // 🔥 SELECTED ACCOUNT
  const accountId = localStorage.getItem("accountId");

  const token = localStorage.getItem("token");


  // 🔥 FETCH BALANCE
  const fetchBalance = async () => {

    try {

      if (!accountId) return;

      const res = await axios.get(
        `http://localhost:3000/api/accounts/balance/${accountId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setBalance(res.data.balance);

    } catch (err) {

      console.log(err);

    }
  };


  useEffect(() => {

    fetchBalance();

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


        {/* BALANCE CARD */}
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
            onSuccess={fetchBalance}
          />

          {/* TRANSFER */}
          <Transfer
            accountId={accountId}
            onSuccess={fetchBalance}
          />

        </div>


        {/* TRANSACTIONS */}
        <TransactionList />

      </div>

    </div>
  );
}

export default Dashboard;