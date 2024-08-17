// Define Schema
const mongoose = require('mongoose')
const url = process.env.MONGODB_URI

mongoose.connect(url)
    .then(() => console.log('connected to MongoDB'))
    .catch((error) => console.log('error connecting to MongoDB:', error.message))

mongoose.set('strictQuery', false)

const todoSchema = new mongoose.Schema({
    title: String,
    complete: Boolean,
    time: String,
    date: String,
    category: String
})

todoSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Todos', todoSchema)