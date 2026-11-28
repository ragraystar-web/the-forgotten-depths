
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

    if (!req.body.items || !Array.isArray(req.body.items) || req.body.items.length === 0) {
        return res.status(400).json({
            error: "Checkout must contain at least one item."
        });
    }

    let total = 0;
    const orderItems = [];
    const requestedQuantities = {};

    for (const item of req.body.items) {
        if (!item || typeof item !== "object" || Array.isArray(item)) {
            return res.status(400).json({
                error: "Each cart item must be a valid object."
            });
        }

        if (typeof item.id !== "string" || item.id.trim() === "") {
            return res.status(400).json({
                error: "Each cart item must have a valid book ID."
            });
        }
        
        const book = books.find((book) => book.id === item.id);

            if (!book) {
                return res.status(400).json({
                    error: `Book with ID ${item.id} does not exist.`
                });
            }

        if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
            return res.status(400).json({
                error: "Quantity must be a positive whole number."
            });
        }

            requestedQuantities[item.id] =
            (requestedQuantities[item.id] || 0) + item.quantity;

        if (requestedQuantities[item.id] > book.stock) {
            return res.status(400).json({
                error: `Insufficient stock for ${book.title}. Available stock: ${book.stock}.`
            });
        }

        const subtotal = book.price * item.quantity;
            total += subtotal;

            orderItems.push({
                id: book.id,
                title: book.title,
                quantity: item.quantity,
                unitPrice: book.price,
                subtotal: subtotal
            });


}

    for (const id in requestedQuantities) {
        const book = books.find((book) => book.id === id);

        book.stock -= requestedQuantities[id];
    }   

    console.log("Checkout request received:", req.body);

    res.json({
        message: "Checkout validated successfully!",
        order: {
        items: orderItems,
        total: total
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
