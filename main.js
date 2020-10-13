// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var cors = require('cors');
var mongoose   = require('mongoose');
require('dotenv').config();

const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const path = require ('path');

var booksController = require('./src/books/books.controller')

// SCHEMAS
const CONNECTION_STRING = process.env.CONNECTION_STRING;
console.log(CONNECTION_STRING);

// FUNCTIONS FOR API

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.text());
app.use(cors());

mongoose.connect(CONNECTION_STRING, {useNewUrlParser: true, useFindAndModify: false });

app.use(express.static('www'));
app.set('port', process.env.PORT || 8080);
app.use(cors());


// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router


router.route('/books')
    .get(booksController.getBooks)
;

// DOCUMENTATION SETUP

// Swagger set up
const options = {
    swaggerDefinition: {
        openapi: "3.0.0",
        info: {
            title: "Leadership Library API",
            version: "1.0.0",
            description: "An API to easily access Leadership Library data (mostly the books we have available)",
        },
        servers: [
            {
                url: "http://localhost:8080/api/",
                description: "Local server (must be running locally)"
            }
        ]
    },
    apis: [ './src/books/books.model.js', './main.js' ]
  };

  const specs = swaggerJsdoc(options);

  router.use("/docs", swaggerUi.serve);

  router.get(
    "/docs",
    swaggerUi.setup(specs, {
      explorer: true
    })
  );


// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================

app.listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});

