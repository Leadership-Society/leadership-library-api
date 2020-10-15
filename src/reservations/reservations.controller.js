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
			email: request.body.email,
			bookId: request.body.bookId,
			deliveryAddress: request.body.deliveryAddress,
			dateCreated: new Date()
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
							console.log('Book found');
							reservationMade = true;

							console.log(`Reservation has been made? ${reservationMade}`);

							if (reservationMade) {
								const msg = {
									to: 'normansophie562@gmail.com', // Change to your recipient
									from: 'leadershipncl@gmail.com', // Change to your verified sender
									subject: `Leadership Library Reservation for ${bookName}`,
									text: `New Loan Request\n A user has recently requested to borrow a book from the library.\n Details:\n Title: ${res.title}\n Student Number: ${res.studentNumber}\n Email: ${reservation.email}\n Address:\n Line 1: ${reservation.deliveryAddress.line1}\n Line 2: ${reservation.deliveryAddress.line2}\n City: ${reservation.deliveryAddress.city}\n Postcode: ${reservation.deliveryAddress.postcode}\n Please email the above student to confirm whether they can loan the book and when they should expect to be able to have their book delivered to them.\n`,
									html: `<h1>Leadership Library: New Loan Request</h1>
									<p><strong>A user has recently requested to borrow a book from the library.</strong></p>
									<hr/>
									<h2>Details:</h2>
									<img style="display: block; margin-left: auto; margin-right: auto;" src="${res.cover}" alt="Book cover for ${res.title}" width="250" />
									<p>Title: ${res.title}</p>
									<p>Student Number: ${reservation.studentNumber}</p>
									<p>Email: ${reservation.email}</p>
									<p>Delivery Address:</p>
									<p>Line 1: ${reservation.deliveryAddress.line1}</p>
									<p>Line 2: ${reservation.deliveryAddress.line2}</p>
									<p>City: ${reservation.deliveryAddress.city}</p>
									<p>Country: ${reservation.deliveryAddress.country}</p>
									<p>Postcode: ${reservation.deliveryAddress.postcode}</p>
									<hr />
									<h2>Instructions</h2>
									<p>Please email the above student to confirm whether they can loan the book and when they should expect to be able to have their book delivered to them.</p>`
								}

								sgMail
									.send(msg)
									.then(() => {
										console.log('Response sent');
										response
											.status(200)
											.send('Details sent');
									})
									.catch((error) => {
										console.log('Error');
										console.log(error);
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