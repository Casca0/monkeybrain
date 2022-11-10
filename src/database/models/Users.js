module.exports = (sequelize, DataTypes) => {
	return sequelize.define('users', {
		user_id: {
			type: DataTypes.STRING,
			allowNull: false,
			primaryKey: true,
		},
		server_id: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		coins: {
			type: DataTypes.INTEGER,
			allowNull: false,
			'default': 1000,
		},
		bank: {
			type: DataTypes.INTEGER,
			allowNull: false,
			'default': 0,
		},
		maceta_counter: {
			type: DataTypes.INTEGER,
			allowNull: false,
			'default': 0,
		},
		wallet_name: {
			type: DataTypes.STRING,
			'default': 'Carteira',
		},
		wallet_color: {
			type: DataTypes.STRING,
			'default': '#32a84a',
		},
	}, {
		timestamps: false,
	});
};
