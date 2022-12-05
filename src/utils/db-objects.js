const Sequelize = require('sequelize');

const sequelize = new Sequelize('database', 'username', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	storage: './src/database/database.sqlite',
});

const Users = require('../database/models/Users')(sequelize, Sequelize.DataTypes);
const UserItems = require('../database/models/UserItems')(sequelize, Sequelize.DataTypes);
const UserAdverts = require('../database/models/UserAdverts')(sequelize, Sequelize.DataTypes);

Reflect.defineProperty(Users.prototype, 'getAdverts', {
	value: async function getAdverts() {
		const adverts = await UserAdverts.findAll({
			where: {
				user_id: this.user_id,
			},
		});

		return adverts;
	},
});

Reflect.defineProperty(Users.prototype, 'cleanAdverts', {
	value: async function cleanAdverts() {
		try {
			return await UserAdverts.destroy({
				where: {
					user_id: this.user_id,
				},
			});
		}
		catch (err) {
			return console.error(err);
		}
	},
});

module.exports = { Users, UserItems, UserAdverts };
