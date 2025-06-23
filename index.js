const express = require('express');
const app = express();
require('dotenv').config();
const fs = require('fs');
const path = require('path');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const userRoutes = require('./routes/userRoutes');
const classRoutes = require("./routes/classRoute");
const resrvRoutes = require("./routes/reservRoute");
const authRoutes = require('./routes/authRoutes');

app.use('/api/auth', authRoutes);
app.use("/user", userRoutes);
app.use("/class", classRoutes);
app.use("/reserv", resrvRoutes);
app.use('/uploads', express.static('uploads'));

const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const events = require('events');
events.defaultMaxListeners = 20;

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`${process.env.APP_NAME} running at http://localhost:${port}`);
});

module.exports = app;