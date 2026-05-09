import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function CreateAccount() {

  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleCreate = async () => {
    try {

      if (!name.trim()) {
        return alert("Please enter account name");
      }

      setLoading(true);

      const token = localStorage.getItem("token");

      const res = await axios.post(
        "https://digital-banking-system-1.onrender.com/api/accounts",
        { name },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("ACCOUNT CREATED:", res.data);

      const account = res.data.account;

      if (!account || !account._id) {
        return alert("Account ID not returned from server");
      }

      localStorage.setItem("accountId", account._id);

      alert("Account Created Successfully");

      navigate("/dashboard");

    } catch (err) {

      console.log(err.response?.data || err.message);

      alert(
        err.response?.data?.message ||
        "Error creating account"
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-blue-100">

      <div className="bg-white p-6 rounded shadow w-96">

        <h1 className="text-xl font-bold mb-4">
          Create Account
        </h1>

        <input
          className="border w-full p-2 mb-3"
          placeholder="Enter name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <button
          onClick={handleCreate}
          className="bg-blue-600 text-white w-full py-2"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Account"}
        </button>

      </div>

    </div>
  );
}

export default CreateAccount;