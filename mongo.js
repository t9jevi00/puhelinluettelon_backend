const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const url =
  `mongodb+srv://Ville_FullStack:${password}@cluster0.emyiw.mongodb.net/phone-app?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })

const personSchema = new mongoose.Schema({
    name: String,
    number: Number,
  })
  
  const Person = mongoose.model('Person', personSchema)
  
  const person = new Person({
    name: name,
    number: number
  })
  
  person.save().then(response => {
    console.log('person saved!')
  })
  
  if(process.argv.length<4){
      console.log("Phonebook:")
    Person.find({}).then(result => {
        result.forEach(person => {
          console.log(person)
        })
        mongoose.connection.close()
      })
  }