// Import
const express = require('express');
const app = express();
const morgan = require('morgan')
require('dotenv').config()
const Todos = require('./models/todo')

// Middleware
app.use(express.json())
app.use(morgan('tiny'))

// Routes
app.get('/',(req,res)=>{
    res.send('<h1>Welcome to Todo-list backend. Visit <a href="/api/todos">/api/todos</a> for more info</h1>')
})

app.get('/api/todos',(req,res)=>{
    Todos.find({})
        .then(todos => res.json(todos))
})

app.get('/api/todos/:id',(req,res)=>{
    const id = req.params.id
    Todos.findById(id)
        .then(todo => {
            if (todo) res.json(todo)
            else res.status(404).json({error:'Not found'})
        })
        .catch(error => console.log(error))
})

app.delete('/api/todos/:id',(req,res)=>{
    const id = req.params.id
    Todos.findByIdAndDelete(id)
        .then(todo => {
            if (todo) res.status(204).end()
            else res.status(404).json({error:'Not found'})
        })
        .catch(error => console.log(error))
})

app.put('/api/todos/:id',(req,res)=>{
    const id = req.params.id
    const body = req.body
    const checkKeys = [ 'title', 'complete', 'time', 'date', 'category' ]
    if (!checkKeys.every(key => key in body)) {
        return res.status(400).json({error: 'Try again. Data is missing.'})
    }

    const newTodo = {
        title: body.title, 
        complete: Boolean(body.complete),
        time: body.time,
        date: body.date,
        category: body.category
    }

    Todos.findByIdAndUpdate(id, newTodo, {new: true})
        .then(updateTodo => res.json(updateTodo))
        .catch(error => console.log(error))
})

app.post('/api/todos',(req,res)=>{
    const body = req.body
    const checkKeys = [ 'title', 'complete', 'time', 'date', 'category' ]
    if (!checkKeys.every(key => key in body)) {
        return res.status(400).json({error: 'Try again. Data is missing.'})
    }

    const newTodo = new Todos({
        title: body.title, 
        complete: Boolean(body.complete),
        time: body.time,
        date: body.date,
        category: body.category
    })

    newTodo.save()
        .then(todo => res.json(todo))
        .catch(error => console.log(error))
})

// Unknown route
const unknownEndpoint = (req, res) => {
    return res.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

const PORT= process.env.PORT
app.listen(PORT,()=>console.log(`Server is running on PORT ${PORT}`))