const { Schema, model } = require('mongoose');

const UserAdverts = new Schema({
	reason: String,
	date: {
		type: String,
		default: new Date.toISOString(),
	},
});

const UserItem = new Schema({
	item_id: Number,
	item_name: String,
	amount: Number,
});

const UserData = new Schema({
	user_id: {
		type: Number,
		require: true,
		unique: true,
	},
	coins: {
		type: Number,
		default: 1000,
		min: 0,
	},
	bank: {
		type: Number,
		default: 0,
		min: 0,
	},
	maceta_counter: {
		type: Number,
		default: 0,
		min: 0,
	},
	wallet_name: {
		type: String,
		default: 'Carteira',
	},
	wallet_color: {
		type: String,
		default: '#32a84a',
	},
	wallet_image: {
		type: String,
		default: '',
	},
	adverts: {
		type: [UserAdverts],
	},
	inventory: {
		type: [UserItem],
	},
});

const userModel = model('Users', UserData);

module.exports = { userModel };
