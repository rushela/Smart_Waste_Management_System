const Route = require('../models/Route');

/**
 * @description Create a new draft route.
 * @route   POST /api/routes
 * @access  Private (for Planners)
 */
exports.createRoute = async (req, res) => {
    try {
        // We only need the 'name' from the request body.
        // The status is automatically set to 'draft' by the model's default value.
        const { name } = req.body;
        
        if (!name) {
            return res.status(400).json({ message: 'Route name cannot be empty.' });
        }

        const newRoute = new Route({ name });
        await newRoute.save();
        
        // Respond with the newly created route and a 201 (Created) status code.
        res.status(201).json(newRoute);
    } catch (error) {
        res.status(400).json({ message: 'Error creating route.', error: error.message });
    }
};

/**
 * @description Get all routes (both draft and published).
 * @route   GET /api/routes
 * @access  Private (for Planners)
 */
exports.getAllRoutes = async (req, res) => {
    try {
        // Fetch all routes from the database, sorted by the most recently created.
        const routes = await Route.find().sort({ createdAt: -1 });
        res.status(200).json(routes);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching routes.', error: error.message });
    }
};

/**
 * @description Get a single route by its ID.
 * @route   GET /api/routes/:id
 * @access  Private (for Planners)
 */
exports.getRouteById = async (req, res) => {
    try {
        const route = await Route.findById(req.params.id);
        if (!route) {
            return res.status(404).json({ message: 'Route not found.' });
        }
        res.status(200).json(route);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching route.', error: error.message });
    }
};

/**
 * @description Update a route's details (e.g., change its name or publish it).
 * @route   PUT /api/routes/:id
 * @access  Private (for Planners)
 */
exports.updateRoute = async (req, res) => {
    try {
        const { name, status } = req.body;

        // The primary use case for update is publishing, so we check for a valid status.
        if (status && !['draft', 'published'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status provided.' });
        }

        const updatedRoute = await Route.findByIdAndUpdate(
            req.params.id,
            { name, status }, // The fields to update
            { new: true, runValidators: true } // Options: return the updated document and run schema validators
        );

        if (!updatedRoute) {
            return res.status(404).json({ message: 'Route not found.' });
        }
        
        res.status(200).json(updatedRoute);
    } catch (error) {
        res.status(400).json({ message: 'Error updating route.', error: error.message });
    }
};

/**
 * @description Delete an unwanted draft route.
 * @route   DELETE /api/routes/:id
 * @access  Private (for Planners)
 */
exports.deleteRoute = async (req, res) => {
    try {
        const routeToDelete = await Route.findById(req.params.id);

        if (!routeToDelete) {
            return res.status(404).json({ message: 'Route not found.' });
        }

        // Business Logic: Only allow 'draft' routes to be deleted. 
        // Published routes should be archived or handled differently, not deleted.
        if (routeToDelete.status === 'published') {
            return res.status(400).json({ message: 'Cannot delete a published route. It must be archived instead.' });
        }

        await Route.findByIdAndDelete(req.params.id);
        
        res.status(200).json({ message: 'Draft route deleted successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting route.', error: error.message });
    }
};