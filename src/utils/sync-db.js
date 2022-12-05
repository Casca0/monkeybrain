const Sequelize = require('sequelize');

const sequelize = new Sequelize('database', 'username', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	storage: './src/database/database.sqlite',
});

require('../database/models/Users')(sequelize, Sequelize.DataTypes);
require('../database/models/UserItems')(sequelize, Sequelize.DataTypes);
require('../database/models/UserAdverts')(sequelize, Sequelize.DataTypes);

const force = process.argv.includes('--force') || process.argv.includes('-f');

if (force) {
	console.log('FORCE ATIVADO!');
}

sequelize.sync({ force }).then(async () => {
	console.log('Banco de dados sincronizado!');
	sequelize.close();
}).catch(console.error);
