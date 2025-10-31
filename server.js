// server.js
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

const db = mysql.createConnection({
  host: "localhost",
  user: "root", // your MySQL username
  password: "ROOT", // your MySQL password
  database: "chem_tracker"
});

db.connect(err => {
  if (err) throw err;
  console.log("✅ Connected to MySQL Database");
});

// --- Signup ---
app.post("/signup", (req, res) => {
  const { username, email, password } = req.body;
  const query = "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";
  db.query(query, [username, email, password], (err) => {
    if (err) return res.status(400).json({ message: "User already exists!" });
    res.status(200).json({ message: "Signup successful!" });
  });
});

// --- Login ---
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const query = "SELECT * FROM users WHERE username = ? AND password = ?";
  db.query(query, [username, password], (err, result) => {
    if (err) return res.status(500).json({ message: "Server error" });
    if (result.length > 0) {
      res.status(200).json({ message: "Login successful!" });
    } else {
      res.status(401).json({ message: "Invalid username or password" });
    }
  });
});

// --- Add Production Record ---
app.post("/addProduction", (req, res) => {
  const { batch_no, prod_date, quantity, raw1, raw2, final_product, efficiency } = req.body;
  const query = `INSERT INTO production (batch_no, prod_date, quantity, raw1, raw2, final_product, efficiency)
                 VALUES (?, ?, ?, ?, ?, ?, ?)`;
  db.query(query, [batch_no, prod_date, quantity, raw1, raw2, final_product, efficiency], (err) => {
    if (err) return res.status(500).json({ message: "Error adding production record" });
    res.status(200).json({ message: "Production record added successfully!" });
  });
});

// --- Fetch All Production Records ---
app.get("/getProduction", (req, res) => {
  db.query("SELECT * FROM production ORDER BY id DESC", (err, result) => {
    if (err) return res.status(500).json({ message: "Error fetching data" });
    res.json(result);
  });
});

app.listen(5000, () => console.log("🚀 Server running on http://localhost:5000"));
