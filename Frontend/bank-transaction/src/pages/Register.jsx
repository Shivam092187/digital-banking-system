import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function Register() {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleRegister = async () => {
    try {

      // 🔥 VALIDATION
      if (!name.trim() || !email.trim() || !password.trim()) {
        return alert("All fields are required");
      }

      setLoading(true);

      const res = await axios.post(
        "https://digital-banking-system-1.onrender.com/api/auth/register",
        {
          name,
          email,
          password,
        }
      );

      console.log(res.data);

      alert("Registration successful");

      navigate("/");

    } catch (err) {

      console.log(err.response?.data || err.message);

      alert(
        err.response?.data?.message ||
        "Register failed"
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-blue-100">

      <div className="bg-white p-6 w-96 rounded shadow">

        <h1 className="text-xl font-bold mb-4">
          Register
        </h1>

        <input
          className="border w-full p-2 mb-3"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          className="border w-full p-2 mb-3"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="border w-full p-2 mb-3"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleRegister}
          disabled={loading}
          className="bg-green-600 text-white w-full py-2"
        >
          {loading ? "Registering..." : "Register"}
        </button>

        {/* 🔥 LOGIN LINK */}
        <p className="text-sm mt-4 text-center">
          Already have an account?{" "}
          <Link
            to="/"
            className="text-blue-600 underline"
          >
            Login
          </Link>
        </p>

      </div>

    </div>
  );
}

export default Register;