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
		profession_id: {
			type: DataTypes.STRING,
			defaultValue: '1010012238750437396',
		},
		wallet_name: {
			type: DataTypes.STRING,
			defaultValue: 'Carteira',
		},
		wallet_color: {
			type: DataTypes.STRING,
			defaultValue: '#32a84a',
		},
		wallet_image: {
			type: DataTypes.STRING,
			defaultValue: '',
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
