require('dotenv').config()
const express 	 = require('express')
const logger	 = require('morgan')
const bodyParser = require('body-parser')
const multerUploads = require('./middleware/multer.middleware')

const Joi 		 = require('@hapi/joi')
Joi.objectId = require('joi-objectid')(Joi)

// routes
const usersRoutes = require('./routes/users.routes')
const productsRoutes = require('./routes/products.routes')
const categoriesRoutes = require('./routes/categories.routes')
const productDetailsRoutes = require('./routes/productDetails.routes')



const app	 = express()

app.use(logger('dev'))
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())


const config = require('config')

const mongoose = require('mongoose')

if (!config.get('PrivateKey')) {
    console.error('FATAL ERROR: PrivateKey is not defined.');
    process.exit(1);
}

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

app.post('/upload', multerUploads, (req, res) => {
    console.log('req.body :', req.body)
})

app.use('/users', usersRoutes)
app.use('/products', productsRoutes)
app.use('/categories', categoriesRoutes)
app.use('/product-details', productDetailsRoutes)



const port = process.env.PORT || 3000
app.listen(port, ()=>{
	console.log(`server running in port ${port}`)
})

