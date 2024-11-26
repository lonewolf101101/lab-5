const express = require('express');
const { authenticate } = require('../middleware/authentication');
const { 
    getPlaceByUId, 
    getPlaceByPId, 
    updatePlaceById, 
    addPlace, 
    deletePlaceById 
} = require('../handlers/placeHandler');

const PlaceRouter = express.Router(); 
const AuthorizedPlaceRouter = express.Router(); // Renamed for clarity

// Public routes for places
PlaceRouter.get('/places/user/:uid', getPlaceByUId);
PlaceRouter.get('/places/:pid', getPlaceByPId);
// PlaceRouter.post('/places', addPlace);

// Middleware for authorized routes
AuthorizedPlaceRouter.use(authenticate);

// Protected routes for places
AuthorizedPlaceRouter.post('/places', addPlace);
AuthorizedPlaceRouter.put('/places/:pid', updatePlaceById);
AuthorizedPlaceRouter.delete('/places/:pid', deletePlaceById);

module.exports = {
    PlaceRouter,
    AuthorizedPlaceRouter
};
