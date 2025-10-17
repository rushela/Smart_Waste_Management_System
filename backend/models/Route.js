const mongoose = require('mongoose');

/**
 * @description Defines the schema for a collection route.
 * Each route has a name and a status to track whether it's a draft
 * or has been officially published for drivers.
 */
const routeSchema = new mongoose.Schema({
    /**
     * The name of the route, e.g., "Colombo Zone A - Morning Shift".
     * This is a required field.
     */
    name: {
        type: String,
        required: [true, 'Route name is required.'],
        trim: true // Removes whitespace from both ends of the string
    },

    /**
     * The current state of the route plan.
     * 'draft': The planner is still working on it. It is not visible to drivers.
     * 'published': The route is finalized and sent to drivers.
     * Defaults to 'draft' when a new route is created.
     */
    status: {
        type: String,
        required: true,
        enum: ['draft', 'published'], // The status can only be one of these two values
        default: 'draft'
    },
    
    // You can expand this model with more fields later, such as:
    // assigned_driver: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver' },
    // vehicle_id: { type: String },
    // stops: [ { bin_id: String, location: { lat: Number, lng: Number } } ],
    // estimated_duration_minutes: { type: Number }

}, {
    /**
     * Mongoose's timestamps option.
     * Automatically adds `createdAt` and `updatedAt` fields to the document,
     * which is useful for tracking when a route was created and last modified.
     */
    timestamps: true
});

const Route = mongoose.model('Route', routeSchema);

module.exports = Route;