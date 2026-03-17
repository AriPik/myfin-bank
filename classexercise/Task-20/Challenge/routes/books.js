const express = require("express");
const router = express.Router();

// In-memory data
let books = [
    { id: 1, title: "1984", author: "Orwell" },
    { id: 2, title: "The Alchemist", author: "Coelho" }
];

// GET /books
router.get("/", (req, res) => {
    res.json(books);
});

// POST /books
router.post("/", (req, res) => {
    const { title, author } = req.body;

    if (!title || !author) {
        return res.status(400).json({
            error: "Title and author are required"
        });
    }

    const newBook = {
        id: books.length ? books[books.length - 1].id + 1 : 1,
        title,
        author
    };

    books.push(newBook);
    res.status(201).json(newBook);
});

// PUT /books/:id
router.put("/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const { title, author } = req.body;

    const book = books.find(b => b.id === id);

    if (!book) {
        return res.status(404).json({ error: "Book not found" });
    }

    if (title) book.title = title;
    if (author) book.author = author;

    res.json(book);
});

// DELETE /books/:id
router.delete("/:id", (req, res) => {
    const id = parseInt(req.params.id);

    const index = books.findIndex(b => b.id === id);

    if (index === -1) {
        return res.status(404).json({ error: "Book not found" });
    }

    const deleted = books.splice(index, 1);

    res.json({
        message: "Book deleted",
        deleted: deleted[0]
    });
});

module.exports = router;