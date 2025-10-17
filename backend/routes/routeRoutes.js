const express = require('express');
const router = express.Router();

// Import the controller functions that contain the logic for each route.
const {
    createRoute,
    getAllRoutes,
    getRouteById,
    updateRoute,
    deleteRoute
} = require('../controllers/routeController');

// Define the API endpoints and link them to the controller functions.

// POST /api/routes - To create a new route.
router.post('/', createRoute);

// GET /api/routes - To get a list of all routes.
router.get('/', getAllRoutes);

// GET /api/routes/:id - To get details of a single route.
router.get('/:id', getRouteById);

// PUT /api/routes/:id - To update a route (e.g., publish it).
router.put('/:id', updateRoute);

// DELETE /api/routes/:id - To delete a draft route.
router.delete('/:id', deleteRoute);

module.exports = router;