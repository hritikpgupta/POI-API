const mongoose = require('mongoose')
const express = require('express')
const products = require('./routes/products')
const users = require('./routes/users')
const auth = require('./routes/auth')
const app = express()


mongoose
    .connect('mongodb+srv://buuzuu:goforgold@mongo-demo-cluster-fu0uk.mongodb.net/test?retryWrites=true&w=majority', { useNewUrlParser: true })
    .then(() => console.log('Connected to MongoDB....'))
    .catch(err => console.error('Could not connect...', err))

app.use(express.json())
app.use('/products', products)
app.use('/users', users)
app.use('/auth', auth)


const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));