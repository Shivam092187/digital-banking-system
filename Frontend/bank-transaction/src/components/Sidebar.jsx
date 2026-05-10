function Sidebar() {
  return (
    <div className="w-64 h-screen bg-blue-900 text-white fixed left-0 top-0">

      <h1 className="font-bold p-4 border-b border-blue-700">
        💳 Digital Bank
      </h1>

      <div className="p-4 space-y-3">

        <button className="bg-green-500 w-full py-2 rounded">
          + Create Account
        </button>

        <div className="bg-blue-700 p-2 rounded">
          Account Menu
        </div>

        <button className="bg-red-500 w-full py-2 rounded mt-3">
          Logout
        </button>

      </div>
    </div>
  );
}

export default Sidebar;