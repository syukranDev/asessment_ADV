'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('listings', {
      id: { type: Sequelize.BIGINT, autoIncrement: true, primaryKey: true },
      name: { type: Sequelize.STRING(255), allowNull: false },
      latitude: { type: Sequelize.DOUBLE, allowNull: false },
      longitude: { type: Sequelize.DOUBLE, allowNull: false },
      user_id: { 
        type: Sequelize.BIGINT, 
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW() },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW() }
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('listings');
  }
};
