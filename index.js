const express = require('express')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const expressValidator = require('express-validator')
const cors = require('cors')

// Les routes
const authRoutes = require('./router/auth')
const userRoutes = require('./router/users')
const categoryRoutes = require('./router/categories')
const productRoutes = require('./router/products')
const braintreeRoutes = require('./router/braintree')
const orderRoutes = require('./router/orders')

// App Config (.env)
require('dotenv').config()
const app = express()

// DB mongoDB
mongoose.connect(process.env.DB)
  .then(() => console.log('DB connectée!'))
  .catch(err => console.error('Erreur..!', err));

// Middleware
app.use(express.json())
app.use(cors())
app.use(cookieParser())
app.use(expressValidator())
// Routes Middleware 
app.use('/api', authRoutes)
app.use('/api/user', userRoutes)
app.use('/api/category', categoryRoutes)
app.use('/api/product', productRoutes)
app.use('/api/braintree', braintreeRoutes)
app.use('/api/order', orderRoutes)
app.get('/', (req, res) => {
    res.send('ExpresJs')
})
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`L'application est lancé sur le port ${port}`))

