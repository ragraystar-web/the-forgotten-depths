
const express = require("express");
const books = require("./books");

const app = express();
const PORT = 3000;

app.use(express.json());

app.get("/", (req, res) => {
    res.send("The Forgotten Depths API is running!");
});

app.get("/api/health", (req, res) => {
    res.json({
        status: "online",
        project: "The Forgotten Depths",
        message: "API is healthy!"
    });
});

app.get("/api/books", (req, res) => {
    res.json(books);
});

app.post("/api/checkout", (req, res) => {
    console.log("Checkout request received:", req.body);

    res.json({
        message: "Checkout endpoint received the request!",
        order: req.body
    });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
