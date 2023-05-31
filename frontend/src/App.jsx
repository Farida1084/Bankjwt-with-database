import { useState } from "react";
import Login from "./Login";

function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  function handleRegister() {
    const user = {
      username: username,
      password: password,
    };

    const userString = JSON.stringify(user);

    fetch("http://localhost:4001/users", {
      method: "POST",
      mode: "cors",
      cache: "no-cache",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: userString,
    }).then((res) => (document.cookie = `thebank=${res}`));
  }

  return (
    <div className="flex justify-center p-16 ">
      <div className="flex flex-col bg-slate-300 rounded-lg gap-4 p-8 h-96 mt-16">
        <h2 className="flex justify-center font-bold text-xl">Registrera</h2>

        <div className="flex flex-col items-center w-auto ">
          <label>Användarnamn: </label>
          <input
            type="text"
            onChange={(e) => setUsername(e.target.value)}
            className="p-2"
          />
          <label>Lösenord: </label>
          <input
            type="text"
            onChange={(e) => setPassword(e.target.value)}
            className="p-2"
          />
        </div>
        <div className="flex justify-center">
          <button
            onClick={handleRegister}
            className=" bg-slate-500 hover:bg-slate-200 hover:text-blue-600 rounded-full p-2 w-24"
          >
            Registrera
          </button>
        </div>
      </div>

      <Login />
    </div>
  );
}

export default App;
