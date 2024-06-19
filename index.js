const express = require("express");
const bodyparser = require("body-parser");
const app = express();
const notesRoutes = require("./routes/notesRoutes");

const dotenv = require("dotenv");
const { testConnection } = require("./database/db");
dotenv.config();

app.use(bodyparser.json());
app.use(notesRoutes);

app.listen(process.env.APP_PORT, async () => {
  await testConnection();
  console.log(`Server running at http://localhost:${process.env.APP_PORT}`);
});