// Define Schema
const mongoose = require('mongoose')
const url = process.env.MONGODB_URI

mongoose.connect(url)
  .then(() => console.log('connected to MongoDB'))
  .catch((error) => console.log('error connecting to MongoDB:', error.message))

mongoose.set('strictQuery', false)

const todoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  complete: {
    type: Boolean,
    required: true,
  },
  time: {
    type: String,
    validate: {
      validator: function(v) {
        return /\d{2}:\d{2}/.test(v)
      },
      message: props => `${props.value} is not a valid time`
    },
    required: true,
  },
  date: {
    type: String,
    validate: {
      validator: function(v) {
        return /\d{4}-\d{2}-\d{2}/.test(v)
      },
      message: props => `${props.value} is not a valid date`
    },
    require: true,
  },
  category: {
    type: String,
    validate: {
      validator: function (v) {
        console.log(v)
        return ['work', 'personal', 'freelance'].includes(v.toLowerCase())
      },
      message: props => `${props.value} is not a valid category`
    },
    required: true
  },
})

todoSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Todos', todoSchema)