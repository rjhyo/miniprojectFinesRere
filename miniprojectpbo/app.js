const express = require("express");
const app = express();
const path = require("path");
const mysql = require("mysql2");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Middleware untuk menerima request body dalam format JSON
app.use(express.json());
app.use(express.static(path.join(__dirname, "public"))); // Menyajikan file statis

// Koneksi ke database MySQL
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "kapal_nelayan"
});

// Endpoint untuk mendapatkan semua data kapal
app.get("/kapal", (req, res) => {
  db.query("SELECT * FROM kapal", (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Database error" });
    }
    res.json(result);
  });
});

// Endpoint untuk menambah kapal (hanya admin)
app.post("/kapal", (req, res) => {
  const { nama_kapal, jenis_kapal, kapasitas_muatan } = req.body;
  db.query("INSERT INTO kapal (nama_kapal, jenis_kapal, kapasitas_muatan) VALUES (?, ?, ?)", [nama_kapal, jenis_kapal, kapasitas_muatan], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Database error" });
    }
    res.status(201).json({ message: "Kapal berhasil ditambahkan" });
  });
});

// Endpoint untuk login (menghasilkan token JWT)
app.post("/auth/login", (req, res) => {
  const { username, password } = req.body;
  // Validasi username dan password dari database (gunakan bcrypt untuk validasi password)
  // Misalnya, jika berhasil login:
  const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: "1h" });
  res.json({ token });
});

// Jalankan server
app.listen(5000, () => {
  console.log("Server berjalan di http://localhost:5000");
});
