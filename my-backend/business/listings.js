const db = require('../model/db.js');
const sq = db.sequelize;
const { getPlaceDescription } = require('../utils/googlegemini.js');
const { calculateDistance } = require('../utils/fn.js');
const limit = 20;

exports.webapp_listings = async function(req, res) {
  let { id: user_id, role_type } = req.token;

//   if (role_type !== 'u') return res.status(403).json({ errMsg: `Access denied. Role type (${role_type}) not allowed.` });

  const qListingAttr = `*`;
  const qListing = `SELECT ::attr FROM listings
  ::cond
  ::order_cond
  `;

  let page = req.query.page;
  let keyword = req.query.keyword;
  let cond = '';
  let sortColumn = req.query.sort_column || 'created_at';
  let sortBy = req.query.sort_by || 'desc';
  let order_cond = `order by ${sortColumn} ${sortBy}`;
  let limitRows = req.query.limit_rows;
  let description = req.query.description || 'false';
  let user_lat = req.query.lat;
  let user_long = req.query.long;

  page = (!page || isNaN(page) || parseInt(page) < 0) ? 0 : parseInt(page) - 1;
  limitRows = (isNaN(limitRows) || !limitRows) ? limit : parseInt(limitRows);
  let offset = page * limitRows;

  let places_listing = {};

  if (keyword && keyword.trim() !== '') {
    keyword = `%${keyword.trim().replace(/ /g, '%')}%`;
    cond = ` where LOWER(name) LIKE LOWER(:keyword) `;
  }

  try {
    let rows = await sq.query(qListing
      .replace(/::attr/, qListingAttr)
      .replace(/::cond/, cond)
      .replace(/::order_cond/, order_cond)
      .concat(` limit :limitRows offset :offset`)
    ,{
      type: sq.QueryTypes.SELECT,
      replacements: { keyword, limitRows, offset },
      logging: false
    });

    if (description === 'true') {
      for (let i = 0; i < rows.length; i++) {
        const listing = rows[i];
        if (!listing.description || listing.description.trim() === '') {
          try {
            const geminiResponse = await getPlaceDescription(listing.name);
            if (geminiResponse && geminiResponse.description_place) {
              rows[i].description = geminiResponse.description_place;
            }
          } catch (error) {
            rows[i].description = 'Description not available';
          }
        }
      }
    }

    if (user_lat && user_long) {
      const userLatitude = parseFloat(user_lat);
      const userLongitude = parseFloat(user_long);
      for (let i = 0; i < rows.length; i++) {
        const listing = rows[i];
        const listingLat = parseFloat(listing.latitude);
        const listingLong = parseFloat(listing.longitude);
        const distance = calculateDistance(userLatitude, userLongitude, listingLat, listingLong);
        rows[i].distance_km = parseFloat(distance.toFixed(2));
      }
      rows.sort((a, b) => a.distance_km - b.distance_km);
    }

    let count = await sq.query(qListing
      .replace(/::attr/, 'count(*) as total_count')
      .replace(/::cond/, cond)
      .replace(/::order_cond/, order_cond)
    ,{
      type: sq.QueryTypes.SELECT,
      replacements: { keyword },
      logging: false
    });

    places_listing.count = count[0].total_count ?? 0;
    places_listing.rows = rows;
    places_listing.limit = limitRows;
    places_listing.offset = offset;

    return res.send({ status: 'success', places_listing });
  } catch (e) {
    console.error(e);
    return res.status(500).send({ errMsg: `Failed to get Listing rows` });
  }
};

exports.read_listings = async function(req, res) {
    const { id: user_id, role_type } = req.token;
    const { id } = req.params;

    if (role_type !== 'a') return res.status(403).json({ errMsg: `Access denied. Role type (${role_type}) not allowed.` });
    if (!id) return res.status(422).json({ errMsg: 'Listing ID is required.' });

    try {
        const listing = await db.listings.findOne({
        where: { id }
        });

        if (!listing) {
        return res.status(422).json({ errMsg: 'Listing not found.' });
        }

        return res.status(200).json({
        status: 'success',
        data: listing
        });

    } catch (error) {
        console.error('Error fetching listing detail:', error);
        res.status(500).json({ error: 'Failed to fetch listing detail ID - ' + `${id ?? 'N/A'}` });
    }
};

exports.update_listings = async function(req, res) {
    const { role_type } = req.token;
    const { id } = req.params;
    const { name, latitude, longitude, user_id } = req.body;

    if (role_type !== 'a') return res.status(403).json({ errMsg: `Access denied. Role type (${role_type}) not allowed.` });
    if (!id) return res.status(422).json({ errMsg: 'Listing ID is required.' });

    try {
        const listing = await db.listings.findOne({
        where: { id }
        });

        if (!listing) return res.status(422).json({ errMsg: 'Listing not found.' });
        
        // KIV
        // if (listing.user_id !== user_id) {
        //   return res.status(403).json({ errMsg: 'Access denied. You can only update your own listings.' });
        // }

        const updateData = {};
        if (name !== undefined) updateData.name = name;
        if (latitude !== undefined) updateData.latitude = latitude;
        if (longitude !== undefined) updateData.longitude = longitude;

        if (user_id !== undefined) {
            const userExists = await db.users.findOne({ where: { id: user_id } });
            if (!userExists) {
                return res.status(422).json({ errMsg: 'Assigned user does not exist.' });
            }
            updateData.user_id = user_id;
        }

        if (Object.keys(updateData).length === 0) {
        return res.status(422).json({ errMsg: 'No valid fields provided for update.' });
        }

        await db.listings.update(updateData, {
        where: { id }
        });

        return res.status(200).json({
        status: 'success',
        message: 'Listing updated successfully.',
        });

    } catch (error) {
        console.error('Error updating listing:', error);
        res.status(500).json({ error: 'Failed to update listing.' });
    }
};

exports.delete_listings = async function(req, res) {
    const { id: user_id, role_type } = req.token;
    const { id } = req.params;

    if (role_type !== 'a') return res.status(403).json({ errMsg: `Access denied. Role type (${role_type}) not allowed.` });
    if (!id) return res.status(422).json({ errMsg: 'Listing ID is required.' });

    try {
        const listing = await db.listings.findOne({
        where: { id }
        });

        if (!listing) return res.status(404).json({ errMsg: 'Listing not found.' });
        
        // KIV
        // if (listing.user_id !== user_id) {
        //   return res.status(403).json({ errMsg: 'Access denied. You can only delete your own listings.' });
        // }

        await db.listings.destroy({
        where: { id}
        });

        return res.status(200).json({
        status: 'success',
        message: `Listing ID ${id} deleted successfully.`
        });

    } catch (error) {
        console.error('Error deleting listing:', error);
        res.status(500).json({ errMsg: `Failed to delete listing ID ${id ?? 'N/A'}` });
    }
}

exports.create_listings = async function(req, res) {
    const { id: user_id, role_type } = req.token;
    let { name, latitude, longitude, description, assignedTo } = req.body;

    if (role_type !== 'a') return res.status(403).json({ errMsg: `Access denied. Role type (${role_type}) not allowed.` });
    if (!name || latitude === undefined || longitude === undefined)  return res.status(422).json({ errMsg: 'Name, latitude, and longitude are required.' });
    if (assignedTo && isNaN(parseInt(assignedTo))) return res.status(422).json({ errMsg: 'Assigned user ID must be an integer.' });
    
    try {
        if (assignedTo) {
            const userExists = await db.users.findOne({ where: { id: assignedTo } });
            if (!userExists) {
                return res.status(422).json({ errMsg: 'Assigned user does not exist.' });
            }
        } else {
            assignedTo = user_id;  // notedev: assigned to admin??
        }

        const newListing = await db.listings.create({
            name,
            latitude,
            longitude,
            user_id: assignedTo
        });

        return res.status(201).json({
            status: 'success',
            message: 'Listing created successfully.'
        });
    } catch (error) {
        console.error('Error creating listing:', error);
        res.status(500).json({ errMsg: 'Failed to create listing.' });
    }
};

exports.getUserList = async function(req, res) {
  try {
    const users = await db.users.findAll({
      attributes: ['id', 'name'],
      raw: true
    });
    return res.status(200).json({ status: 'success', data: users });
  } catch (error) {
    console.error('Error fetching user list:', error);
    return res.status(500).json({ errMsg: 'Failed to fetch user list' });
  }
};