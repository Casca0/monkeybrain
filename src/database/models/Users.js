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
		profession: {
			type: DataTypes.STRING,
			defaultValue: 'Desempregado',
		},
		wallet_name: {
			type: DataTypes.STRING,
			defaultValue: 'Carteira',
		},
		wallet_color: {
			type: DataTypes.STRING,
			defaultValue: '#32a84a',
		},
		experience: {
			type: DataTypes.INTEGER,
			defaultValue: 0,
		},
		user_level: {
			type: DataTypes.INTEGER,
			defaultValue: 1,
		},
		coins: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: 1000,
		},
		bank: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: 0,
		},
		maceta_counter: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: 0,
		},
	}, {
		timestamps: false,
	});
};
