const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bcrypt = require("bcryptjs");

const app = express();

// ---------- Middleware ----------
app.use(cors());
app.use(express.json());

// ---------- MySQL Pool ----------
const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "ROOT",   // change if needed
  database: "chem_tracker"
});

// ---------- TEST DB CONNECTION ----------
db.getConnection((err, conn) => {
  if (err) {
    console.error("❌ MySQL connection failed:", err.message);
  } else {
    console.log("✅ MySQL connected successfully");
    conn.release();
  }
});

// ================= AUTH SECTION =================

// ---------- SIGNUP ----------
app.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const sql =
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";

    db.query(sql, [username, email, hashedPassword], (err) => {
      if (err) {
        return res
          .status(400)
          .json({ message: "Username or Email already exists" });
      }
      res.json({ message: "Signup successful" });
    });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// ---------- LOGIN ----------
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const sql = "SELECT id, password FROM users WHERE name=?";

  db.query(sql, [username], async (err, result) => {
    if (err || result.length === 0) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const isMatch = await bcrypt.compare(password, result[0].password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    res.json({
      message: "Login successful",
      userId: result[0].id
    });
  });
});

// ================= PRODUCTION SECTION =================

// ---------- ADD PRODUCTION ----------
app.post("/addProduction", (req, res) => {
  const {
    batch_no,
    prod_date,
    quantity,
    raw1,
    raw2,
    final_product,
    efficiency
  } = req.body;

  if (!batch_no || !prod_date || !quantity || !raw1 || !raw2 || !final_product || !efficiency) {
    return res.status(400).json({ message: "All production fields are required" });
  }

  const sql = `
    INSERT INTO production
    (batch_no, prod_date, quantity, raw1, raw2, final_product, efficiency)  
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [batch_no, prod_date, quantity, raw1, raw2, final_product, efficiency],
    (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Failed to add production record" });
      }
      res.json({ message: "Production record added successfully" });
    }
  );
});

// ---------- FETCH PRODUCTION ----------
app.get("/getProduction", (req, res) => {
  db.query(
    "SELECT * FROM production ORDER BY id DESC",
    (err, result) => {
      if (err) {
        return res.status(500).json({ message: "Failed to fetch production data" });
      }
      res.json(result);
    }
  );
});

// ================= ROOT =================
app.get("/", (req, res) => {
  res.send("🚀 ChemTracker API Running Successfully");
});

// ---------- START SERVER ----------
const PORT = 4000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
