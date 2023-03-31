const express = require("express");
const connectDB = require("./config/db");
const initRoute = require("./routes/index");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
require("dotenv").config();


const app = express();

connectDB();

app.use(express.json());
app.use(express.urlencoded({ extends: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());





initRoute(app);

app.listen(process.env.PORT, (req, res) => {
  console.log(`server is running on port ${process.env.PORT}`);
});
