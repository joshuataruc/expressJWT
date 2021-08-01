const express =  require('express');
const AuthRoute =  require('./routes/auth');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotenv = require('dotenv/config');

const app = express();

// middleware
// we need this for us to send json data
app.use(bodyParser.json());
 
// route middleware
app.use('/api/user', AuthRoute);

mongoose.connect(
    process.env.DB_CONNECTION,
    {useNewUrlParser: true , useUnifiedTopology: true },
    () => console.log('connected to db biatch!')
);




const PORT = process.env.PORT || 3000 ;

app.listen(PORT, console.log(`Server Running on localhost:${PORT}`));