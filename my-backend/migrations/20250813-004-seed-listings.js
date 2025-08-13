'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('listings', [
      { name: 'Petronas Twin Towers, Kuala Lumpur', latitude: 3.1579, longitude: 101.7115, user_id: 3, created_at: new Date(), updated_at: new Date() },
      { name: 'KL Tower, Kuala Lumpur', latitude: 3.1528, longitude: 101.7039, user_id: 5, created_at: new Date(), updated_at: new Date() },
      { name: 'Penang Hill, Penang', latitude: 5.4340, longitude: 100.2760, user_id: 1, created_at: new Date(), updated_at: new Date() },
      { name: 'Kek Lok Si Temple, Penang', latitude: 5.3996, longitude: 100.2735, user_id: 2, created_at: new Date(), updated_at: new Date() },
      { name: 'Langkawi Sky Bridge, Kedah', latitude: 6.3502, longitude: 99.6773, user_id: 4, created_at: new Date(), updated_at: new Date() },
      { name: 'Eagle Square, Langkawi', latitude: 6.3006, longitude: 99.8510, user_id: 3, created_at: new Date(), updated_at: new Date() },
      { name: 'Mount Kinabalu, Sabah', latitude: 6.0753, longitude: 116.5583, user_id: 2, created_at: new Date(), updated_at: new Date() },
      { name: 'Sipadan Island, Sabah', latitude: 4.1140, longitude: 118.6280, user_id: 5, created_at: new Date(), updated_at: new Date() },
      { name: 'Tunku Abdul Rahman Park, Sabah', latitude: 5.9788, longitude: 116.0006, user_id: 1, created_at: new Date(), updated_at: new Date() },
      { name: 'Sarawak Cultural Village, Kuching', latitude: 1.7470, longitude: 110.3048, user_id: 2, created_at: new Date(), updated_at: new Date() },
      { name: 'Gunung Mulu National Park, Sarawak', latitude: 4.1333, longitude: 114.8500, user_id: 4, created_at: new Date(), updated_at: new Date() },
      { name: 'Bako National Park, Sarawak', latitude: 1.7167, longitude: 110.4667, user_id: 5, created_at: new Date(), updated_at: new Date() },
      { name: 'Cameron Highlands, Pahang', latitude: 4.4700, longitude: 101.4500, user_id: 1, created_at: new Date(), updated_at: new Date() },
      { name: 'Genting Highlands, Pahang', latitude: 3.4252, longitude: 101.7933, user_id: 3, created_at: new Date(), updated_at: new Date() },
      { name: 'Fraser’s Hill, Pahang', latitude: 3.7167, longitude: 101.7333, user_id: 4, created_at: new Date(), updated_at: new Date() },
      { name: 'Tioman Island, Pahang', latitude: 2.7900, longitude: 104.1700, user_id: 5, created_at: new Date(), updated_at: new Date() },
      { name: 'Pulau Redang, Terengganu', latitude: 5.7778, longitude: 103.0153, user_id: 1, created_at: new Date(), updated_at: new Date() },
      { name: 'Pulau Perhentian, Terengganu', latitude: 5.9167, longitude: 102.7333, user_id: 3, created_at: new Date(), updated_at: new Date() },
      { name: 'Kuala Terengganu Drawbridge', latitude: 5.3335, longitude: 103.1402, user_id: 2, created_at: new Date(), updated_at: new Date() },
      { name: 'Sultan Mahmud Airport, Terengganu', latitude: 5.3826, longitude: 103.1026, user_id: 4, created_at: new Date(), updated_at: new Date() },
      { name: 'Jonker Street, Melaka', latitude: 2.1963, longitude: 102.2465, user_id: 5, created_at: new Date(), updated_at: new Date() },
      { name: 'A Famosa Fort, Melaka', latitude: 2.1924, longitude: 102.2501, user_id: 1, created_at: new Date(), updated_at: new Date() },
      { name: 'Stadthuys, Melaka', latitude: 2.1932, longitude: 102.2486, user_id: 2, created_at: new Date(), updated_at: new Date() },
      { name: 'Masjid Selat Melaka', latitude: 2.1668, longitude: 102.2462, user_id: 3, created_at: new Date(), updated_at: new Date() },
      { name: 'Putra Mosque, Putrajaya', latitude: 2.9351, longitude: 101.6919, user_id: 5, created_at: new Date(), updated_at: new Date() },
      { name: 'Perdana Putra, Putrajaya', latitude: 2.9350, longitude: 101.6911, user_id: 4, created_at: new Date(), updated_at: new Date() },
      { name: 'IOI City Mall, Putrajaya', latitude: 2.9675, longitude: 101.7141, user_id: 3, created_at: new Date(), updated_at: new Date() },
      { name: 'Seri Wawasan Bridge, Putrajaya', latitude: 2.9305, longitude: 101.6912, user_id: 2, created_at: new Date(), updated_at: new Date() },
      { name: 'Legoland Malaysia, Johor', latitude: 1.4261, longitude: 103.6298, user_id: 1, created_at: new Date(), updated_at: new Date() },
      { name: 'Sultan Abu Bakar Mosque, Johor Bahru', latitude: 1.4551, longitude: 103.7516, user_id: 3, created_at: new Date(), updated_at: new Date() },
      { name: 'Desaru Coast, Johor', latitude: 1.5696, longitude: 104.2898, user_id: 4, created_at: new Date(), updated_at: new Date() },
      { name: 'Endau-Rompin National Park, Johor', latitude: 2.3900, longitude: 103.3500, user_id: 5, created_at: new Date(), updated_at: new Date() },
      { name: 'Menara Alor Setar, Kedah', latitude: 6.1184, longitude: 100.3696, user_id: 2, created_at: new Date(), updated_at: new Date() },
      { name: 'Gunung Jerai, Kedah', latitude: 5.7922, longitude: 100.4350, user_id: 3, created_at: new Date(), updated_at: new Date() },
      { name: 'Zahir Mosque, Alor Setar', latitude: 6.1181, longitude: 100.3682, user_id: 1, created_at: new Date(), updated_at: new Date() },
      { name: 'Bukit Bintang, Kuala Lumpur', latitude: 3.1453, longitude: 101.7100, user_id: 4, created_at: new Date(), updated_at: new Date() },
      { name: 'Batu Caves, Selangor', latitude: 3.2379, longitude: 101.6841, user_id: 5, created_at: new Date(), updated_at: new Date() },
      { name: 'Sunway Lagoon, Selangor', latitude: 3.0738, longitude: 101.6069, user_id: 1, created_at: new Date(), updated_at: new Date() },
      { name: 'i-City, Shah Alam', latitude: 3.0643, longitude: 101.4851, user_id: 2, created_at: new Date(), updated_at: new Date() },
      { name: 'Sultan Salahuddin Mosque, Shah Alam', latitude: 3.0738, longitude: 101.5194, user_id: 3, created_at: new Date(), updated_at: new Date() },
      { name: 'Sekinchan, Selangor', latitude: 3.5221, longitude: 101.0988, user_id: 4, created_at: new Date(), updated_at: new Date() },
      { name: 'Pulau Pangkor, Perak', latitude: 4.2105, longitude: 100.5534, user_id: 5, created_at: new Date(), updated_at: new Date() },
      { name: 'Kellie’s Castle, Perak', latitude: 4.4728, longitude: 101.0620, user_id: 1, created_at: new Date(), updated_at: new Date() },
      { name: 'Lost World of Tambun, Perak', latitude: 4.6253, longitude: 101.1556, user_id: 2, created_at: new Date(), updated_at: new Date() },
      { name: 'Taiping Lake Gardens, Perak', latitude: 4.8504, longitude: 100.7412, user_id: 3, created_at: new Date(), updated_at: new Date() },
      { name: 'Bukit Merah Laketown Resort, Perak', latitude: 4.9983, longitude: 100.6572, user_id: 4, created_at: new Date(), updated_at: new Date() },
      { name: 'Pulau Kapas, Terengganu', latitude: 5.2167, longitude: 103.2667, user_id: 5, created_at: new Date(), updated_at: new Date() },
      { name: 'Bukit Tinggi, Pahang', latitude: 3.4233, longitude: 101.8278, user_id: 2, created_at: new Date(), updated_at: new Date() },
      { name: 'Teluk Cempedak, Pahang', latitude: 3.8140, longitude: 103.3728, user_id: 1, created_at: new Date(), updated_at: new Date() },
      { name: 'Pantai Cenang, Langkawi', latitude: 6.2968, longitude: 99.7266, user_id: 3, created_at: new Date(), updated_at: new Date() }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('listings', null, {});
  }
};
