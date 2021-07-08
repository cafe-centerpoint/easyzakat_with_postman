// npm third-party
const express = require('express');
const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');
// const expressLayouts = require('express-ejs-layouts');

//import Routes user-defined
const authRoute = require('./routes/auth');
const postRoute = require('./routes/posts');

//konfigurasi .env
dotenv.config();

//connect to db
mongoose.connect(process.env.DB_CONNECT, 
    { 
        useNewUrlParser: true, 
        useUnifiedTopology: true 
    }, () => 
    console.log('connected to db')
);


//Middleware
app.use(express.json());

//Route middlewares
app.use('/api/user', authRoute);
app.use('/api/posts', postRoute);
app.listen(3000, () => console.log('Server up and running....'));