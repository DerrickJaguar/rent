// app.js
import express from "express";
import mysql from "mysql2";
import cors from "cors";

const app = express();
const PORT = 5000;

// --- Middleware ---
app.use(cors({ origin: "http://localhost:5173" })); // frontend origin
app.use(express.json());

// --- MySQL connection ---
const db = mysql.createConnection({
  host: "localhost",
  user: "root",       // replace with your DB user
  password: "",       // replace with your DB password
  database: "rent_management" // your DB name
});

db.connect((err) => {
  if (err) console.error("MySQL connection error:", err);
  else console.log("Connected to MySQL database!");
});

// --- TENANTS ROUTES ---
app.get("/tenants", (req, res) => {
  db.query("SELECT * FROM tenants", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.post("/tenants", (req, res) => {
  const { firstName, lastName, email, leaseEndDate, rentAmount } = req.body;
  const query = `
    INSERT INTO tenants (firstName, lastName, email, leaseEndDate, rentAmount)
    VALUES (?, ?, ?, ?, ?)
  `;
  db.query(query, [firstName, lastName, email, leaseEndDate, rentAmount], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: result.insertId, ...req.body });
  });
});

app.put("/tenants/:id", (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, email, leaseEndDate, rentAmount } = req.body;
  const query = `
    UPDATE tenants
    SET firstName=?, lastName=?, email=?, leaseEndDate=?, rentAmount=?
    WHERE id=?
  `;
  db.query(query, [firstName, lastName, email, leaseEndDate, rentAmount, id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id, ...req.body });
  });
});

app.delete("/tenants/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM tenants WHERE id=?", [id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Tenant deleted" });
  });
});

// --- PROPERTIES ROUTES ---
app.get("/properties", (req, res) => {
  db.query("SELECT * FROM properties", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.post("/properties", (req, res) => {
  const { title, address, city, rentAmount, status, bedrooms, bathrooms, squareFootage, description, tenantId } = req.body;
  const query = `
    INSERT INTO properties 
    (title, address, city, rentAmount, status, bedrooms, bathrooms, squareFootage, description, tenantId)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  db.query(query, [title, address, city, rentAmount, status, bedrooms, bathrooms, squareFootage, description, tenantId], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: result.insertId, ...req.body });
  });
});

app.put("/properties/:id", (req, res) => {
  const { id } = req.params;
  const { title, address, city, rentAmount, status, bedrooms, bathrooms, squareFootage, description, tenantId } = req.body;
  const query = `
    UPDATE properties
    SET title=?, address=?, city=?, rentAmount=?, status=?, bedrooms=?, bathrooms=?, squareFootage=?, description=?, tenantId=?
    WHERE id=?
  `;
  db.query(query, [title, address, city, rentAmount, status, bedrooms, bathrooms, squareFootage, description, tenantId, id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id, ...req.body });
  });
});

app.delete("/properties/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM properties WHERE id=?", [id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Property deleted" });
  });
});

// --- PAYMENTS ROUTES ---
app.get("/payments", (req, res) => {
  db.query("SELECT * FROM payments", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.post("/payments", (req, res) => {
  const { tenant_id, property_id, amount, paymentDate, status } = req.body;
  const query = `
    INSERT INTO payments (tenant_id, property_id, amount, paymentDate, status)
    VALUES (?, ?, ?, ?, ?)
  `;
  db.query(query, [tenant_id, property_id, amount, paymentDate, status], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: result.insertId, ...req.body });
  });
});

app.put("/payments/:id", (req, res) => {
  const { id } = req.params;
  const { tenant_id, property_id, amount, paymentDate, status } = req.body;
  const query = `
    UPDATE payments
    SET tenant_id=?, property_id=?, amount=?, paymentDate=?, status=?
    WHERE id=?
  `;
  db.query(query, [tenant_id, property_id, amount, paymentDate, status, id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id, ...req.body });
  });
});

app.delete("/payments/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM payments WHERE id=?", [id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Payment deleted" });
  });
});

// --- Start server ---
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));