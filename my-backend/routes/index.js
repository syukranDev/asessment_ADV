var express = require('express');
var router = express.Router();

const db = require('../model/db.js');
const Op = db.Sequelize.Op;
const sq = db.sequelize;
const JWT_SECRET = process.env.JWT_SECRET;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { apiTokenVerify } = require('../middlewares/auth.js');
const { getPointsOfInterest } = require('../utils/googlegemini.js');

//TBA 
// use saved data to avoid hitting Gemini API
// switch mechanism when to use Gemini API or saved data
// is description needed?
router.get('/listing', apiTokenVerify, async function(req, res, next) {
  const {id, name, email, role_type} = req.token;
  let { lat, long} = req.query

  if (role_type !== 'u') return res.status(403).json({ errMsg: `Access denied. Role type (${role_type}) not allowed.` });
  if (!lat || !long) {
    return res.status(422).json({ errMsg: 'Latitude and longitude are required.' });
  }

  try {
    const numberOfResults = 3;
    const poiList = await getPointsOfInterest(numberOfResults ,lat, long);

    const listings = [];
    for (const poi of poiList) {
      const listing = await db.listings.create({
        user_id: id,
        name: poi.name,
        // description: poi.description, //notedev: WIP
        latitude: poi.latitude,
        longitude: poi.longitude,
      });
      
      const listingWithDistance = {
        ...listing.toJSON(),
        distance_km: poi.distance_km
      };
      listings.push(listingWithDistance);
    }
    return res.status(200).json({
      status: 'success',
      data: listings
    });
  }
  catch (error) {
    console.error('Error fetching listings:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
