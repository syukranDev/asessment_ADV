'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('users', [
      {
        name: 'test_user_01',
        email: 'test_user_01@gmail.com',
        password: '$2b$10$I4S/Es5ZO3gkALkXS.QcwuzZnxVt/pVUYCDdzz.Dmw/0UyImcBl6a',
        role_type: 'u',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'admin',
        email: 'admin@gmail.com',
        password: '$2b$10$rQ.mvOzTesEYE3DB3x9Ta.svZoNHXTx1/Bmq27FwgOMOsWIao1BNa',
        role_type: 'a',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'test_user_03',
        email: 'test_user_03@gmail.com',
        password: '$2b$10$gF3n8syhunWRNjB6aoaeKOJV7r4IncDtWpMGh0nD3WUjdkXEHQi1G',
        role_type: 'u',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'test_user_04',
        email: 'test_user_04@gmail.com',
        password: '$2b$10$qtgUoXohPMUiMyuOfnROZu0U2qx2zXvJfJ/JS0T7qj6NEHM4yvk4m',
        role_type: 'u',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'test_user_05',
        email: 'test_user_05@gmail.com',
        password: '$2b$10$nFak1H/7ydxkbL2k97xP.eqSxdIm5INIxk/f2tODXwrQPnqL5fak6',
        role_type: 'u',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'test_user_06',
        email: 'test_user_06@gmail.com',
        password: '$2b$10$mRj4yhrfxBZFmKTQVGZQpukBfo8nZshcWBVvzOiNdY1LbxGaf9XqC',
        role_type: 'u',
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', {
      email: [
        'test_user_01@gmail.com',
        'admin@gmail.com',
        'test_user_03@gmail.com',
        'test_user_04@gmail.com',
        'test_user_05@gmail.com',
        'test_user_06@gmail.com'
      ]
    }, {});
  }
};
