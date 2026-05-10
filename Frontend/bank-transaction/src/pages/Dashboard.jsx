import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";

function Dashboard() {
  const [balance, setBalance] = useState(0);

  const accountId = localStorage.getItem("accountId");
  const token = localStorage.getItem("token");

  const fetchBalance = async () => {
    try {
      if (!accountId) return;

      const res = await axios.get(
        `https://digital-banking-system-1.onrender.com/api/accounts/balance/${accountId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
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
    <div className="flex min-h-screen bg-gray-100">

      <Sidebar />

      <div className="flex-1 md:ml-64 p-4">

        <h1 className="text-2xl font-bold mb-4">
          Dashboard
        </h1>

        <div className="bg-blue-600 text-white p-6 rounded">
          <h2>Current Balance</h2>
          <h1 className="text-3xl font-bold">
            ₹ {balance || 0}
          </h1>
        </div>

      </div>
    </div>
  );
}

export default Dashboard;