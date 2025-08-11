var express = require('express');
var router = express.Router();

const db = require('../model/db.js');
const { apiTokenVerify } = require('../middlewares/auth.js');
const { getPointsOfInterest } = require('../utils/googlegemini.js');

//TBA 
// use saved data to avoid hitting Gemini API i.e switch mechanism when to use Gemini API or saved data
// is description needed?

// router.get('/listing', apiTokenVerify, async function(req, res, next) {
//   const {id, name, email, role_type} = req.token;
//   let { lat, long} = req.query

//   if (role_type !== 'u') return res.status(403).json({ errMsg: `Access denied. Role type (${role_type}) not allowed.` });
//   if (!lat || !long) {
//     return res.status(422).json({ errMsg: 'Latitude and longitude are required.' });
//   }

//   try {
//     const poiList = await getPointsOfInterest(lat, long);

//     const listings = [];
//     for (const poi of poiList) {
//       const listing = await db.listings.create({
//         user_id: id,
//         name: poi.name,
//         // description: poi.description, //notedev: WIP
//         latitude: poi.latitude,
//         longitude: poi.longitude,
//       });
      
//       const listingWithDistance = {
//         ...listing.toJSON(),
//         distance_km: poi.distance_km
//       };
//       listings.push(listingWithDistance);
//     }
//     return res.status(200).json({
//       status: 'success',
//       data: listings
//     });
//   }
//   catch (error) {
//     console.error('Error fetching listings:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

router.get('/listing', apiTokenVerify, async function(req, res, next) {
  const { id, role_type } = req.token;
  let { lat, long, page = 1, limit_rows = 10 } = req.query;

  if (role_type !== 'u') return res.status(403).json({ errMsg: `Access denied. Role type (${role_type}) not allowed.` });
  if (!lat || !long) return res.status(422).json({ errMsg: 'Latitude and longitude are required.' });

  const radiusKm = 2;
  const limit = parseInt(limit_rows, 10) || 10;
  const offset = (parseInt(page, 10) - 1) * limit;

  try {
    const countResult = await db.sequelize.query(`
      SELECT COUNT(*) as total
      FROM listings
      WHERE (6371 * acos(
        cos(radians(:lat)) *
        cos(radians(latitude)) *
        cos(radians(longitude) - radians(:long)) +
        sin(radians(:lat)) *
        sin(radians(latitude))
      )) <= :radius
    `, {
      replacements: { lat, long, radius: radiusKm },
      type: db.Sequelize.QueryTypes.SELECT,
      logging: console.log
    });
    let total_count = countResult[0]?.total ? parseInt(countResult[0].total) : 0;

    if (total_count > 0) {
      console.log('================ NICEEEEE')
      const cachedListings = await db.sequelize.query(`
        SELECT *, 
          (6371 * acos(
            cos(radians(:lat)) *
            cos(radians(latitude)) *
            cos(radians(longitude) - radians(:long)) +
            sin(radians(:lat)) *
            sin(radians(latitude))
          )) AS distance_km
        FROM listings
        WHERE (6371 * acos(
            cos(radians(:lat)) *
            cos(radians(latitude)) *
            cos(radians(longitude) - radians(:long)) +
            sin(radians(:lat)) *
            sin(radians(latitude))
        )) <= :radius
        ORDER BY distance_km ASC
        LIMIT :limit OFFSET :offset
      `, {
        replacements: { lat, long, radius: radiusKm, limit, offset },
        type: db.Sequelize.QueryTypes.SELECT,
        logging: console.log
      });

      return res.status(200).json({
        status: 'success',
        result: {
          current_page: parseInt(page, 10),
          limit_rows: limit,
          total_count,
          data: cachedListings
        }
      });
    }

    const poiList = await getPointsOfInterest(lat, long);
    for (const poi of poiList) {
      await db.listings.create({
        user_id: id,
        name: poi.name,
        latitude: poi.latitude,
        longitude: poi.longitude,
      });
    }

    const countResultAfter = await db.sequelize.query(`
      SELECT COUNT(*) as total
      FROM listings
      WHERE (6371 * acos(
        cos(radians(:lat)) *
        cos(radians(latitude)) *
        cos(radians(longitude) - radians(:long)) +
        sin(radians(:lat)) *
        sin(radians(latitude))
      )) <= :radius
    `, {
      replacements: { lat, long, radius: radiusKm },
      type: db.Sequelize.QueryTypes.SELECT
    });
    total_count = countResultAfter[0]?.total ? parseInt(countResultAfter[0].total, 10) : 0;

    const cachedListings = await db.sequelize.query(`
      SELECT *, 
        (6371 * acos(
          cos(radians(:lat)) *
          cos(radians(latitude)) *
          cos(radians(longitude) - radians(:long)) +
          sin(radians(:lat)) *
          sin(radians(latitude))
        )) AS distance_km
      FROM listings
      WHERE (6371 * acos(
          cos(radians(:lat)) *
          cos(radians(latitude)) *
          cos(radians(longitude) - radians(:long)) +
          sin(radians(:lat)) *
          sin(radians(latitude))
      )) <= :radius
      ORDER BY distance_km ASC
      LIMIT :limit OFFSET :offset
    `, {
      replacements: { lat, long, radius: radiusKm, limit, offset },
      type: db.Sequelize.QueryTypes.SELECT
    });

    return res.status(200).json({
      status: 'success',
      result: {
        current_page: parseInt(page, 10),
        limit_rows: limit,
        total_count,
        data: cachedListings
      }
    });

  } catch (error) {
    console.error('Error fetching listings:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
