const mongoose = require('mongoose');

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
