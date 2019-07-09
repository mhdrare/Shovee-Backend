const express 	 = require('express')
const logger	 = require('morgan')
const bodyParser = require('body-parser')

const Joi 		 = require('@hapi/joi')
Joi.objectId = require('joi-objectid')(Joi)

// routes
const usersRoutes = require('./routes/users.routes')

const app	 = express()

app.use(logger('dev'))
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

const mongoose = require('mongoose')

mongoose.set('useCreateIndex', true)
mongoose.connect('mongodb+srv://shovee:shoveeadmin@cluster0-r6cir.mongodb.net/test?retryWrites=true&w=majority', {
    useNewUrlParser: true, 
    dbName: 'shovee'
}).then(() => {
    console.log('connection success')
}).catch(err => {
    console.log(`connection error `, err)
    process.exit();
})

// public routes
app.get('/', (req, res) => {
	res.json({message: 'server running'})

})

app.use('/users', usersRoutes)



const port = process.env.PORT || 3000
app.listen(port, ()=>{
	console.log(`server running in port ${port}`)
})

