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

var booksController = require('./src/books/books.controller');
const reservationsController = require('./src/reservations/reservations.controller');

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

/**
 * @swagger
 * tags:
 *  name: Books
 *  description: Accessing Books collection
 * 
 * path:
 *  /books:
 *    get:
 *      summary: Retrieves books from the books collection.
 *      tags: [Books]
 *      parameters:
 *        - in: query
 *          name: _id
 *          schema:
 *            type: string
 *          description: Book ID (automatically generated)
 *        - in: query
 *          name: title
 *          schema:
 *            type: string
 *          description: Book title
 *        - in: query
 *          name: author
 *          schema:
 *            type: string
 *          description: Author of the book
 *        - in: query
 *          name: status
 *          schema:
 *            type: number
 *          description: ID for the status (1=available, 2=reserved, 3=quarantined)
 *      responses:
 *        "200":
 *          description: List of books fitting the filters provided
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                items:
 *                  $ref: '#/components/schemas/Book'
 *        "404":
 *          description: No books found.
 *        "500":
 *          description: Error retrieving books (database side)
 */
router.route('/books')
  .get(booksController.getBooks)
;

/**
 * @swagger
 * tags:
 *  name: Reservations
 *  description: Reserving books to borrow
 * 
 * path:
 *  /reservations:
 *    post:
 *      summary: Request to reserve a book
 *      tags: [Reservations]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                studentNumber:
 *                  type: string
 *                deliveryType:
 *                  type: string
 *                phoneNumber:
 *                  type: string
 *                bookId:
 *                  type: string
 *                deliveryAddress:  
 *                  type: object
 *                  properties:
 *                    line1:
 *                      type: string
 *                    line2:
 *                      type: string
 *                    postcode:
 *                      type: string
 *      responses:
 *        "200":
 *          description: Successfully submitted reservation request.
 *        "500":
 *          description: There was an error preventing you from submitting your reservation request.
 */
router.route('/reservations')
  .post(reservationsController.addReservation)
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
    apis: [ './src/books/books.model.js', './main.js', './src/reservations/reservations.model.js' ]
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

