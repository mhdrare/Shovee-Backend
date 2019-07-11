require('dotenv').config()
const express 	 = require('express')
const logger	 = require('morgan')
const bodyParser = require('body-parser')
const path       = require('path')

const Joi 		 = require('@hapi/joi')
Joi.objectId = require('joi-objectid')(Joi)

// routes
const usersRoutes = require('./routes/users.routes')
const userDetailsRoutes = require('./routes/userDetail.routes')
const productsRoutes = require('./routes/products.routes')
const categoriesRoutes = require('./routes/categories.routes')
const checkoutRoutes = require('./routes/checkout.routes')
const resetPassword = require('./routes/resetPassword.routes')

const {cloudinaryConfig} = require('./config/cloudinary.config')

const app	 = express()
 
app.use(logger('dev'))
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use('*', cloudinaryConfig)


const config = require('config')

const mongoose = require('mongoose')

if (!config.get('PrivateKey')) {
    console.error('FATAL ERROR: PrivateKey is not defined.');
    process.exit(1);
}

mongoose.set('useCreateIndex', true)
mongoose.connect('mongodb+srv://shovee:shoveeadmin@cluster0-r6cir.mongodb.net/test?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useFindAndModify: false, 
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

app.use('/', resetPassword)
app.use('/users', usersRoutes)
app.use('/users', userDetailsRoutes)
app.use('/products', productsRoutes)
app.use('/categories', categoriesRoutes)
app.use('/checkout', checkoutRoutes)
app.use('/wishlist', wishlistRoutes)



const port = process.env.PORT || 3000
app.listen(port, ()=>{
	console.log(`server running in port ${port}`)
})

