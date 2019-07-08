const express 	 = require('express')
const logger	 = require('morgan')
const bodyParser = require('body-parser')

const app	 = express()

app.use(logger('dev'))
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

// public routes
app.get('/', (req, res) => {
	res.json({message: 'server running'})

})


const port = process.env.PORT || 3000
app.listen(port, ()=>{
	console.log('server running in port 3000')
})

