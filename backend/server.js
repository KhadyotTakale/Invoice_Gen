const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Simple route to check server
app.get("/", (req, res) => {
  res.send("Server is up and running!");
});

// MySQL connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Khadyot@123", // Your MySQL password here
  database: "estimate_app",
});

db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err);
  } else {
    console.log("Connected to MySQL database ✅");
  }
});

// Get all clients (for dropdowns or client selection)
app.get("/clients", (req, res) => {
  db.query("SELECT * FROM clients", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Create new client
app.post("/clients", (req, res) => {
  const { id, name, email, phone, company, address } = req.body;
  const sql =
    "INSERT INTO clients (id, name, email, phone, company, address) VALUES (?, ?, ?, ?, ?, ?)";
  db.query(sql, [id, name, email, phone, company, address], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Client added successfully" });
  });
});

// Get all estimates
app.get("/estimates", (req, res) => {
  db.query("SELECT * FROM estimates", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Create new estimate (with items)
app.post("/estimates", (req, res) => {
  const estimate = req.body;
  const estimateSql = `
    INSERT INTO estimates 
    (id, estimate_number, client_id, sub_total, tax, discount, total, status, date, due_date, terms, notes, logo, created_at) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  db.query(
    estimateSql,
    [
      estimate.id,
      estimate.estimateNumber,
      estimate.client.id,
      estimate.subTotal,
      estimate.tax,
      estimate.discount,
      estimate.total,
      estimate.status,
      estimate.date,
      estimate.dueDate,
      estimate.terms,
      estimate.notes,
      estimate.logo,
      estimate.createdAt,
    ],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });

      // Insert estimate items
      const itemSql = `
        INSERT INTO estimate_items 
        (id, estimate_id, description, quantity, rate, tax, amount) 
        VALUES ?`;

      const items = estimate.items.map((item) => [
        item.id,
        estimate.id,
        item.description,
        item.quantity,
        item.rate,
        item.tax,
        item.amount,
      ]);

      db.query(itemSql, [items], (itemErr) => {
        if (itemErr) return res.status(500).json({ error: itemErr.message });
        res.json({ message: "Estimate created successfully" });
      });
    }
  );
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
