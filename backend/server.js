import bodyParser from "body-parser";
import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import mysql from "mysql";

const app = express();
app.use(cors());
app.use(bodyParser.json());
const PORT = 4001;
//const users = [];
//const accounts = [];
const SECRET = "sommar";

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "bank",
  port: 8889,
});

// function generateAccessToken(userId) {
//   return jwt.sign(userId, secret);
// }
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  console.log("req.headers", req.headers);
  console.log("authHeader", authHeader);
  console.log("token", token);

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, SECRET, (err, userId) => {
    console.log(err);

    if (err) return res.sendStatus(403);

    req.userId = userId;

    next();
  });
}

//let userIds = 1;

app.post("/users", (req, res) => {
  const user = req.body;
  // const { username, password } = user;
  console.log("req body:" + user.username + " " + user.password);
  db.query(
    "INSERT INTO users (username, password) VALUES(?,?)",
    [user.username, user.password],
    (err, results) => {
      console.log("err", err);
      console.log("result register ", results);
      const insertId = results.insertId;

      db.query(
        "INSERT INTO accounts (user_id, amount) VALUES (?, ?)",
        [insertId, 200],
        (err, results) => {
          console.log("result register", results);
          if (err) {
            res.sendStatus(500);
          } else {
            res.send("ok");
          }
        }
      );
    }
  );
});

//1. skapa token från user. skicka token till användare
//2. Användare skickar med sin token i nästa request -> omvandlar token till user ingen

// app.post("/sessions", (req, res) => {
//   const user = req.body;

//   const dbUser = users.find((u) => u.username == user.username);

//   if (dbUser != null && dbUser.password == user.password) {
//     const token = generateAccessToken(dbUser.id);
//     console.log("token", token);

//     res.json({ token });
//   } else {
//     res.status = 401;
//     res.json();
//   }
// });

/*app.get("me/accounts", authenticateToken, (req, res) => {
  console.log("userId ", req.userId);

  //används userId för att hämta account.
  const dbAccount = accounts.find((a) => a.userId == req.userId);

  res.json(dbAccount);

  res.json({ userId: req.userId });
});*/

app.post("/sessions", (req, res) => {
  const user = req.body;

  db.query(
    "SELECT * FROM users WHERE username =?",
    [user.username],
    (err, results) => {
      if (err) {
        console.log("err", err);
        res.sendStatus(500);
      } else {
        const dbUser = results[0];
        console.log(dbUser);

        if (dbUser.password === user.password) {
          const token = jwt.sign(dbUser.id, SECRET);
          console.log(token);
          res.json(token);
        }
      }
    }
  );
});

app.get("/me/accounts", authenticateToken, (req, res) => {
  db.query(
    "SELECT * FROM accounts WHERE user_id = ?",
    [req.userId],
    (err, results) => {
      if (err) {
        res.sendStatus(500);
      } else {
        const myAccount = results[0];
        console.log(myAccount);
        res.json(myAccount);
      }
    }
  );
});

app.listen(PORT, () => {
  console.log("Server started on port" + PORT);
});
