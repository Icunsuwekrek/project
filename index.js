const express = require("express");
const app = express();
require("dotenv").config();
const fs = require("fs");
const path = require("path");

// Middleware untuk parsing JSON dan URL-encoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Membuat folder public/uploads jika belum ada
const uploadDir = path.join(__dirname, "public", "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Serve file statis agar bisa akses gambar via /public/uploads/namafile.jpg
app.use("/public", express.static(path.join(__dirname, "public")));

// Routes
const userRoutes = require("./routes/userRoutes");
const classRoutes = require("./routes/classRoute");
const resrvRoutes = require("./routes/reservRoute");
const authRoutes = require("./routes/authRoutes");
const ticketRoutes = require("./routes/tiketRoutes");
const eventRoutes = require("./routes/eventRoutes");
const bannerRoutes = require("./routes/bannerRoutes");

app.use("/api/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/class", classRoutes);
app.use("/reserv", resrvRoutes);
app.use("/tiket", ticketRoutes);
app.use("/event", eventRoutes);
app.use("/banner", bannerRoutes);

// Atur batas maksimum listener jika diperlukan
const events = require("events");
events.defaultMaxListeners = 20;

// Jalankan server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`${process.env.APP_NAME} running at http://localhost:${port}`);
});

module.exports = app;
