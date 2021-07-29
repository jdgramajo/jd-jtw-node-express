const express = require("express");
const cookieParser = require("cookie-parser");

const app = express();

app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.json({ message: "Welcome to JWTing!" });
});

require("./routes/auth")(app);
require("./routes/user")(app);

const PORT = process.env.PORT || 443;
console.log(`${process.env.ENABLE_HTTPS}`);
const HTTPS = process.env.ENABLE_HTTPS === "true";
if (HTTPS) {
  const fs = require("fs");
  const key = fs.readFileSync("./.vscode/certs/key.pem");
  const cert = fs.readFileSync("./.vscode/certs/cert.pem");
  const https = require("https");
  https.createServer({ key, cert }, app).listen(PORT, () => {
    console.log(`HTTPS server running in port ${PORT}`);
  });
} else {
  app.listen(PORT, () => {
    console.log(`HTTP server running in port ${PORT}`);
  });
}

// Persistence Related code
const db = require("./models");

db.sequelize
  .authenticate()
  .then(() => {
    console.log("Connection to database successfull.");
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });
