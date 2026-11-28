
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

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
