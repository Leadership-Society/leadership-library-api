var mongoose   = require('mongoose');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SEND_GRID_API_KEY);

var reservationsSchema = require('./reservations.model');
var booksSchema = require('../books/books.model');

const Reservation = mongoose.model('reservations', reservationsSchema, 'reservations');
const Book = mongoose.model('book', booksSchema, 'books');

const reservationsController = {
	addReservation: async (request, response) => {
		var reservation = new Reservation({ 
			studentNumber: request.body.studentNumber,
			phoneNumber: request.body.phoneNumber,
			bookId: request.body.bookId,
			deliveryAddress: request.body.deliveryAddress,
			dateCreated: new Date(),
			deliveryType: request.body.deliveryType
		});

		var reservationMade = false;
		var bookName = '';

		reservation.save()
			.then((success, err) => {
				if (err) {
					response
						.status(500)
						.send('Could make reservation');
				}

				if (success) {
					Book.findById(reservation.bookId, (error, res) => {
						if (error) {
							response
								.status(500)
								.send('Could not retrieve book');
						}

						if (res && !error) {
							reservationMade = true;

							if (reservationMade) {
								var msg = {}
								if (reservation.deliveryAddress) {
									msg = {
										to: 'sophie.norman2@btinternet.com', // Change to your recipient
										from: 'leadershipncl@gmail.com', // Change to your verified sender
										subject: `Leadership Library Reservation for ${bookName}`,
										text: `New Loan Request\nA user has recently requested to borrow a book from the library.\nDetails:\nTitle: ${res.title}\nStudent Number: ${res.studentNumber}\nDelivery Type: ${reservation.deliveryType}\nPhone Number: (+44) ${reservation.phoneNumber}\nAddress:\nLine 1: ${reservation.deliveryAddress.line1}\nLine 2: ${reservation.deliveryAddress.line2}\nPostcode: ${reservation.deliveryAddress.postcode}\nDelivery Notes: ${reservation.deliveryNotes}\nPlease email the above student to confirm their booking and to start the process of delivering their book.`,
										html: `<h1>Leadership Library: New Loan Request</h1>
										<p><strong>A user has recently requested to borrow a book from the library.</strong></p>
										<hr/>
										<h2>Details:</h2>
										<img style="display: block; margin-left: auto; margin-right: auto;" src="${res.cover}" alt="Book cover for ${res.title}" width="250" />
										<p>Title: ${res.title}</p>
										<p>Student Number: ${reservation.studentNumber}</p>
										<p>Delivery Type: ${reservation.deliveryType}</p>
										<p>Phone Number: (+44)${reservation.phoneNumber}</p>
										<p>Delivery Address:</p>
										<p>Line 1: ${reservation.deliveryAddress.line1}</p>
										<p>Line 2: ${reservation.deliveryAddress.line2}</p>
										<p>Postcode: ${reservation.deliveryAddress.postcode}</p>
										<p>Delivery Notes: ${reservation.deliveryNotes}</p>
										<hr />
										<h2>Instructions</h2>
										<p>Please email the above student to confirm whether they can loan the book and when they should expect to be able to have their book delivered to them (or details about pickup).</p>`
									}
								} else {
									msg = {
										to: 'sophie.norman2@btinternet.com', // Change to your recipient
										from: 'leadershipncl@gmail.com', // Change to your verified sender
										subject: `Leadership Library Reservation for ${bookName}`,
										text: `New Loan Request\nA user has recently requested to borrow a book from the library.\nDetails:\nTitle: ${res.title}\nStudent Number: ${res.studentNumber}\nDelivery Type: ${reservation.deliveryType}\nPlease email the above student to confirm the book reservation and to arrange a date and time to pick up the book in a public place.`,
										html: `<h1>Leadership Library: New Loan Request</h1>
										<p><strong>A user has recently requested to borrow a book from the library.</strong></p>
										<hr />
										<h2>Details:</h2>
										<p><img src="${res.cover}" alt="Book cover for ${res.title}" width="250" /></p>
										<p>Title: ${res.title}</p>
										<p>Student Number: ${reservation.studentNumber}</p>
										<p>Delivery Type: ${reservation.deliveryType}</p>
										<hr />
										<h2>Instructions</h2>
										<p>Please email the above student to confirm the book reservation and to arrange a date and time to pick up the book in a public place.</p>`
									}
								}

								sgMail
									.send(msg)
									.then(() => {
										response
											.status(200)
											.send('Details sent');
									})
									.catch((error) => {
										response
											.status(500)
											.send(error);
									});
							}
						}
					})
				}
			});
	}
};

module.exports = reservationsController;