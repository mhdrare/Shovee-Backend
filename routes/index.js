'use strict'

const productController = require('../app/api/controllers/products.controller')
const productDetailController = require('../app/api/controllers/productDetails.controller')
const categoriesController = require('../app/api/controllers/categories.controller')


module.exports = (app) => {
    /* GET METHOD */
    app.get('/products', productController.findAll)
    app.get('/products/:id', productController.findById)
    app.get('/categories', categoriesController.findAll)
    app.get('/categories/:id', categoriesController.findById)
    
    /* POST METHOD */
    app.post('/products', productController.create)
    app.post('/categories', categoriesController.create)

    /* PATCH METHOD */
    app.patch('/products/:id', productController.update)
    app.patch('/categories/:id', categoriesController.update)

    /* DELETE METHOD */
    app.delete('/products/:id', productController.delete)
    app.delete('/categories/:id', categoriesController.delete)
}