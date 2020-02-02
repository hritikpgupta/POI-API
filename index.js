const mongoose = require('mongoose')
mongoose
    .connect('mongodb+srv://buuzuu:goforgold@mongo-demo-cluster-fu0uk.mongodb.net/test?retryWrites=true&w=majority', { useNewUrlParser: true })
    .then(() => console.log('Connected to MongoDB....'))
    .catch(err => console.error('Could not connect...', err))