module.exports = (sequelize, Sequelize) => {
  let Model = sequelize.define('listings', {
    id: {
      type: Sequelize.BIGINT,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: Sequelize.STRING(255),
      allowNull: false
    },
    latitude: {
      type: Sequelize.DOUBLE,
      allowNull: false
    },
    longitude: {
      type: Sequelize.DOUBLE,
      allowNull: false
    },
    user_id: {
      type: Sequelize.BIGINT,
      allowNull: false
    }
  }, {
    timestamps: true,
    underscored: true,
    freezeTableName: true
  });

  return Model;
};
