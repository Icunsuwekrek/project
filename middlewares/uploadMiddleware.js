const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Buat path absolut ke folder uploads
const uploadDir = path.join(__dirname, "..", "public", "uploads");

// Pastikan folder uploads sudah ada
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir); // Simpan ke public/uploads
  },
  filename: function (req, file, cb) {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname)); // Contoh: 165xxx.jpg
  },
});

const upload = multer({ storage });

module.exports = upload;
