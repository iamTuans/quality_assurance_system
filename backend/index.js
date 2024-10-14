
const express = require("express");
const app = express();

require("dotenv").config();

app.get("/", (red, res) => {
    res.send("Hello, again");
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => console.log('Application listening on port ${PORT}!'));