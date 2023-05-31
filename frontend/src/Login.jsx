import { useState } from "react";

let myToken;

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [money, setMoney] = useState("");

  function handleLogin() {
    const user = {
      username: username,
      password: password,
    };

    const userString = JSON.stringify(user);

    fetch("http://localhost:4001/sessions", {
      method: "POST",
      mode: "cors",
      cache: "no-cache",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        //Athorization: "Bearer" + ""
      },
      body: userString,
    })
      .then((res) => res.json())
      .then((data) => {
        myToken = data;
        console.log(myToken);
        document.cookie = `thebank=${data}`;
      });
  }

  function handleGetAccount() {
    fetch("http://localhost:4001/me/accounts", {
      method: "GET",
      mode: "cors",
      cache: "no-cache",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + myToken,
      },
      //body: userString,
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setMoney(data.amount);
      });
  }

  return (
    <div className="flex justify-center p-16">
      <div className="flex flex-col bg-slate-300 rounded-lg gap-4 p-8 h-96 max-h-full ">
        <h2 className=" flex justify-center font-bold text-xl ">Login</h2>
        <div className=" flex flex-col items-center w-auto">
          <label>Användarnamn: </label>
          <input
            type="text"
            onChange={(e) => setUsername(e.target.value)}
            className="p-2"
          />
          <label>Lösenord: </label>
          <input
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            className="p-2"
          />
        </div>

        <div className="flex justify-center gap-2">
          <button
            onClick={handleLogin}
            className=" bg-slate-500 hover:bg-slate-200 hover:text-blue-600 rounded-full p-2 w-24"
          >
            Login
          </button>
          <button
            onClick={handleGetAccount}
            className="bg-slate-500 hover:bg-slate-200 hover:text-blue-600 rounded-full p-2 w-24"
          >
            Get Account
          </button>
        </div>
        <div className="flex justify-center p-8 ">
          <h2>Amount: {money}</h2>
        </div>
      </div>
    </div>
  );
}

export default Login;
