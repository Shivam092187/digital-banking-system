import axios from "axios";

const API = axios.create({

  // 🔥 LIVE BACKEND
  baseURL: "https://digital-banking-system-1.onrender.com/api",

  // 🔥 IMPORTANT
  withCredentials: true,

});

export default API;