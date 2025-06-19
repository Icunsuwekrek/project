const express = require('express');
const app = express();
require('dotenv').config();

const userRoutes = require('./routes/userRoutes');

app.use(express.json());
app.use('/api', userRoutes);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`${process.env.APP_NAME} running at http://localhost:${port}`);
});

module.exports = app;