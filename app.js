const express = require('express');
const { engine } = require('express-handlebars');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const http = require("http");

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Parsing middleware
// Parse application/x-www-form-urlencoded
// app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.urlencoded({extended: true})); // New

// Parse application/json
// app.use(bodyParser.json());
app.use(express.json()); // New

// Static Files
app.use('/static', express.static('public'));

// Templating Engine
app.engine('handlebars', engine( {extname: '.hbs' }));
app.set('view engine', 'handlebars'); 

const routes = require('./server/routes/routes');
app.use('/', routes);

app.listen(port, () => console.log(`Listening on port ${port}`));
