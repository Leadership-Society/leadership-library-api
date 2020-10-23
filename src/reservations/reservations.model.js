const mongoose = require('mongoose');

/**
 * @swagger
 *  components:
 *      schemas:
 *          Reservation:
 *              type: object
 *              required:
 *                  - studentNumber
 *                  - bookId
 *                  - dateCreated
 *                  - deliveryType
 *              properties:
 *                  studentNumber:
 *                      type: string
 *                      description: Newcastle Uni Student Number from their student card
 *                  bookId:
 *                      type: string
 *                      description: ID of the book the student is borrowing
 *                  deliveryAddress:
 *                      type: object
 *                      properties:
 *                          line1:
 *                              type: string
 *                              description: Line 1 of the delivery address
 *                          line2:
 *                              type: string
 *                              description: Line 2 of the delivery address
 *                          postcode:
 *                              type: string
 *                              description: Postcode of the address to deliver to
 *                  dateCreated:
 *                      type: string
 *                      format: date-time
 *                  deliveryType:
 *                      type: string
 *                      desccription: How we will get the book to them
 *                  phoneNumber:
 *                      type: string
 *                      desccription: Their phone number
 *                  deliveryNotes:
 *                      type: string
 *                      desccription: Any special notes for delivering the book
 *              example:
 *                  studentNumber: B1234567
 *                  bookId: abcdefg1234567
 *                  deliveryAddress:
 *                      line1: Flat 1
 *                      line2: Student Accommodation
 *                      postcode: NE1 1XX
 *                  dateCreated: 2020/10/14-20:41:00
 *                  deliveryType: pickup
 *                  phoneNumber: 7755555553
 */
const schema = new mongoose.Schema({
	studentNumber: {
		type: String,
		required: [true, 'Student number is required']
	},
	bookId: {
		type: String,
		required: [true, 'Book ID is required']
	},
	deliveryAddress: {
		type: Object
	},
	dateCreated: {
		type: Date,
		required: [true, 'Date created is required']
	},
	deliveryType: {
		type: String,
		required: [true, 'A delivery type must be specified']
	},
	phoneNumber: {
		type: String
	},
	deliveryNotes: {
		type: String
	}
});

module.exports = schema;
