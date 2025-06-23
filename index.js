const express = require('express');
const app = express();
require('dotenv').config();

const userRoutes = require('./routes/userRoutes');
const classRoutes = require("./routes/classRoute");
const resrvRoutes = require("./routes/reservRoute");

app.use(express.json());
app.use("/user", userRoutes);
app.use("/class", classRoutes);
app.use("/reserv", resrvRoutes);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`${process.env.APP_NAME} running at http://localhost:${port}`);
});

module.exports = app;