module.exports = (sequelize, DataTypes) => {
	return sequelize.define('user_adverts', {
		user_id: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		reason: {
			type: DataTypes.STRING,
		},
	}, {
		timestamps: false,
	});
};
