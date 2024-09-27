//
const express = require("express");
const mongoose = require("mongoose");
const routes = require("./routes");

const app = express();

const { PORT = 3001 } = process.env;

mongoose.set("strictQuery", true);
mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connected to DataBase");
  })
  .catch(console.error);

app.use(express.json());

app.use(routes);

app.use((req, res) => {
  res.status(404).send({ message: "Router not found" });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
