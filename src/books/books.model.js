const mongoose = require('mongoose');

/**
 * @swagger
 *  components:
 *      schemas:
 *          Book:
 *              type: object
 *              required:
 *                  - title
 *                  - author
 *                  - status
 *                  - cover
 *              properties:
 *                  title:
 *                      type: string
 *                      description: Title of the book
 *                  author:
 *                      type: string
 *                      description: Author of the book
 *                  status:
 *                      type: number
 *                      description: Book availability
 *                  cover:
 *                      type: string
 *                      description: URL of the book cover image
 *                  reservation:
 *                      type: string
 *                      description: ID of the reservation associated with the book
 *              example:
 *                  title: How To Be A Leader
 *                  author: Anthony Leader
 *                  status: 1
 *                  cover: https://www.google.co.uk
 *                  reservation: abcdefgh123456
*/
const schema = new mongoose.Schema({
	title: {
		type: String,
		required: [true, 'Book title is required.']
	},
	author: {
		type: String,
		required: [true, 'Book author is required.']
	},
	status: {
		type: Number,
		required: [true, 'Status is required.']
	},
	cover: {
		type: String,
		required: [true, 'URL for book cover is required.']
	},
	reservation: {
		type: String
	}
});

module.exports = schema;
