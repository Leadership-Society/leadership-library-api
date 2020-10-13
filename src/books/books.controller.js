var mongoose   = require('mongoose');

var booksSchema = require('./books.model');

const Book = mongoose.model('book', booksSchema, 'books');

const booksController = {
	getBooks: async (request, response) => {
		var parameters = request.query;
		Book.find(parameters, (err, result) => {
			if (err) {
				response
					.status(500)
					.send('Unable to retrieve data - error with server.')
			}

			if (result) {
				if (result.length > 0) {
					response.json(result);
				} else {
					response
						.status(404)
						.send('No books found.')
				}
			}
		})
	}
};

module.exports = categoriesController;