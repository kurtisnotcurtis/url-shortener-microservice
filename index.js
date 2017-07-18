const express = require("express");
const path = require("path");

const port = process.env.PORT || 3000;
var app = express();

app.set("view engine", "pug");

app.get("/", function (req, res) { // Serve homepage (static view)
  var locals = {
    client_ip: req.ip
  };
  
  res.render(path.join(__dirname, "views", "index"), locals);
  
  if (req.query) {
      // Forward to app.get("/:url")
  }
});

app.get("/:url", function (req, res) { // Handle passed url param
  
  res.json();
});

app.listen(port);