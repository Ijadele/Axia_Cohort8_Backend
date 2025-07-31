const bookModel = require("../models/book.model");
const userModel = require("../models/user.model");

const createBook = async (req, res) => {
    const {authors, ...others} = req.body
    const {id} = req.user
    const allAuthors = [...authors, id]

    try {
        // go ahead and create a book
        const newBook = new bookModel({authors: allAuthors, ...others});
        const savedBook = await newBook.save();
        // update the user's info
        for (const authorId of allAuthors) {
            await userModel.findByIdAndUpdate(authorId, {$push:{books:savedBook.id } }, { new: true })
        }
        return res.send("books created successfully!")
    } catch (error) {
        return res.send(error.message)
    }
};

const getBook = async (req, res) => {
    const {bookId} = req.query
    try {
        const book = await bookModel.findById(bookId)
        return res.json(book).populate("authors")
    } catch (error) {
        return res.send(error.message)   
    }
};

module.exports = { createBook, getBook };