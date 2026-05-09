import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      const res = await axios.post("http://localhost:3000/api/register", {
        name,
        email,
        password,
      });

      console.log(res.data);

      alert("Registration successful");

      navigate("/");

    } catch (err) {
      console.log(err);
      alert("Register failed");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-blue-100">

      <div className="bg-white p-6 w-96 rounded shadow">

        <h1 className="text-xl font-bold mb-4">Register</h1>

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
          className="bg-green-600 text-white w-full py-2"
        >
          Register
        </button>

      </div>

    </div>
  );
}

export default Register;