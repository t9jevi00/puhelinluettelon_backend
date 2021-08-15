const morgan = require('morgan')
const express = require('express')
const app = express()
const cors = require('cors')

app.use(express.static('build'))
app.use(cors())
app.use(express.json())

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

app.use(requestLogger)

morgan.token('body', function (req, res) {
    return[
        JSON.stringify(req.body)
    ]
})

app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

const http = require('http')

let persons = [
    {
        id: 1,
        name: "Arto Hellas",
        number: "040-123456",
      },
      {
        id: 2,
        name: "Ada Lovelace",
        number: "39-44-5323523",
      },
      {
        id: 3,
        name: "Dan Abramov",
        number: "12-43-234345",
      },
      {
        id: 4,
        name: "Mary Poppendick",
        number: "39-23-6423122",
      }
]

app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    
    if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
})

app.get('/info', (req, res) => {
    const peoples = persons.length
    const date = new Date()
    res.send(`<p>Phonebook has info for ${peoples} people</p></br>${date}`)
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
  
    response.status(204).end()
})
  
app.post('/api/persons', (request, response) => {
    const body = request.body
  
    if (!body.name || !body.number) {
      return response.status(400).json({ 
        error: 'content missing' 
      })
    }
    if(persons.map(person => person.name).includes(body.name)){
        return response.status(400).json({ 
            error: 'Name must be unique' 
          })
    }
  
    const person = {
      name: body.name,
      number: body.number,
      id: Math.random() * (1000 - 1) + 1,
    }
  
    persons = persons.concat(person)
  
    response.json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})