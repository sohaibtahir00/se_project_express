const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const routes = require("./routes");
const { login, createUser } = require("./controllers/users");
const auth = require("./middlewares/auth");

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

app.post("/signin", login);
app.post("/signup", createUser);

app.use(auth);
app.use(routes);
app.use(cors());

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
