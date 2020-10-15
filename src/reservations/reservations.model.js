const mongoose = require('mongoose');

/**
 * @swagger
 *  components:
 *      schemas:
 *          Reservation:
 *              type: object
 *              required:
 *                  - studentNumber
 *                  - email
 *                  - bookId
 *                  - deliveryAddress
 *                  - dateCreated
 *              properties:
 *                  studentNumber:
 *                      type: string
 *                      description: Newcastle Uni Student Number beginning with B01234...
 *                  email:
 *                      type: string
 *                      format: email
 *                      description: Student's email to contact them
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
 *                          city:
 *                              type: string
 *                              description: City to deliver to
 *                          country:
 *                              type: string
 *                              description: Country to deliver to
 *                          postcode:
 *                              type: string
 *                              description: Postcode of the address to deliver to
 *                  dateCreated:
 *                      type: string
 *                      format: date-time
 *              example:
 *                  studentNumber: B1234567
 *                  email: student.email@email.com
 *                  bookId: abcdefg1234567
 *                  deliveryAddress:
 *                      line1: Flat 1
 *                      line2: Student Accommodation
 *                      city: Newcastle upon Tyne
 *                      country: United Kingdom
 *                      postcode: NE1 1XX
 *                  dateCreated: 2020/10/14-20:41:00
 */
const schema = new mongoose.Schema({
	studentNumber: {
		type: String,
		required: [true, 'Student number is required']
	},
	email: {
		type: String,
		required: [true, 'Email is required']
	},
	bookId: {
		type: String,
		required: [true, 'Book ID is required']
	},
	deliveryAddress: {
		type: Object,
		required: [true, 'Delivery Address is required']
	},
	dateCreated: {
		type: Date,
		required: [true, 'Date created is required']
	}
});

/*

Address: 

line1
line2
city
country
postcode

*/

module.exports = schema;
