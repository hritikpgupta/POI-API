const mongoose = require('mongoose')
const express = require('express')
const products = require('./routes/products')
const reset = require('./routes/passwordReset')
const users = require('./routes/users')
const token = require('./routes/paytmToken')
const config = require('config')
const auth = require('./routes/auth')
const upload = require('./routes/uploadProfilePic')
const app = express()


if (!config.get('jwtPrivateKey')) {
    console.error('jwt Key Not defined')
    process.exit(1)
} else if (!config.get('cloudName')) {
    console.error('cloud name Not defined')
    process.exit(1)
} else if (!config.get('api_key')) {
    console.error('api_Key Not defined')
    process.exit(1)
} else if (!config.get('api_secret')) {
    console.error('api secret Not defined')
    process.exit(1)
}
mongoose
    .connect('mongodb+srv://buuzuu:goforgold@mongo-demo-cluster-fu0uk.mongodb.net/test?retryWrites=true&w=majority', { useNewUrlParser: true })
    .then(() => console.log('Connected to MongoDB....'))
    .catch(err => console.error('Could not connect...', err))

app.use(express.json())
app.use('/products', products)
app.use('/users', users)
app.use('/auth', auth)
app.use('/paytm', token)
app.use('/resetPassword', reset)
app.use('/uploadProfileImage', upload)


const port = process.env.PORT || 7000;
app.listen(port, () => console.log(`Listening on port ${port}...`));