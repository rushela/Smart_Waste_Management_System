/**
 * Calculation utilities for worker module
 * Calculates star points and payments based on waste collection data
 */

// Star points rates per kg of recyclable waste
const STAR_POINTS_RATES = {
  recyclable: 10,  // 10 points per kg
  organic: 5,      // 5 points per kg
  general: 0,      // No points for general waste
  hazardous: 0,    // No points for hazardous waste
  mixed: 2         // 2 points per kg for mixed recyclables
};

// Payment rates per kg of recyclable waste (in currency units)
const PAYMENT_RATES = {
  recyclable: 0.50,  // $0.50 per kg
  organic: 0.20,     // $0.20 per kg
  general: 0,        // No payment for general waste
  hazardous: 0,      // No payment for hazardous waste
  mixed: 0.15        // $0.15 per kg for mixed
};

// Contamination penalty percentage
const CONTAMINATION_PENALTY = 0.5; // 50% reduction

/**
 * Calculate star points awarded for a collection
 * @param {string} wasteType - Type of waste collected
 * @param {number} weight - Weight in kg
 * @param {boolean} contaminated - Whether the waste is contaminated
 * @returns {number} Star points awarded
 */
function calculateStarPoints(wasteType, weight, contaminated = false) {
  if (!wasteType || weight <= 0) return 0;
  
  const rate = STAR_POINTS_RATES[wasteType] || 0;
  let points = rate * weight;
  
  // Apply contamination penalty
  if (contaminated) {
    points = points * CONTAMINATION_PENALTY;
  }
  
  // Round to nearest integer
  return Math.round(points);
}

/**
 * Calculate payment amount for a collection
 * @param {string} wasteType - Type of waste collected
 * @param {number} weight - Weight in kg
 * @param {boolean} contaminated - Whether the waste is contaminated
 * @returns {number} Payment amount
 */
function calculatePayment(wasteType, weight, contaminated = false) {
  if (!wasteType || weight <= 0) return 0;
  
  const rate = PAYMENT_RATES[wasteType] || 0;
  let payment = rate * weight;
  
  // Apply contamination penalty
  if (contaminated) {
    payment = payment * CONTAMINATION_PENALTY;
  }
  
  // Round to 2 decimal places
  return Math.round(payment * 100) / 100;
}

/**
 * Calculate both star points and payment
 * @param {string} wasteType - Type of waste collected
 * @param {number} weight - Weight in kg
 * @param {boolean} contaminated - Whether the waste is contaminated
 * @returns {Object} Object with starPoints and payment
 */
function calculateRewards(wasteType, weight, contaminated = false) {
  return {
    starPoints: calculateStarPoints(wasteType, weight, contaminated),
    payment: calculatePayment(wasteType, weight, contaminated)
  };
}

/**
 * Get available waste types
 * @returns {Array} Array of waste type strings
 */
function getWasteTypes() {
  return Object.keys(STAR_POINTS_RATES);
}

/**
 * Check if waste type is eligible for rewards
 * @param {string} wasteType - Type of waste
 * @returns {boolean} True if eligible for rewards
 */
function isRewardable(wasteType) {
  return STAR_POINTS_RATES[wasteType] > 0 || PAYMENT_RATES[wasteType] > 0;
}

/**
 * Calculate efficiency score for a worker session
 * @param {number} totalBins - Total bins assigned
 * @param {number} collectedBins - Bins successfully collected
 * @param {number} errors - Number of errors
 * @returns {number} Efficiency score (0-100)
 */
function calculateEfficiency(totalBins, collectedBins, errors = 0) {
  if (totalBins === 0) return 0;
  
  const collectionRate = (collectedBins / totalBins) * 100;
  const errorPenalty = errors * 2; // Each error reduces score by 2%
  
  const efficiency = Math.max(0, collectionRate - errorPenalty);
  return Math.round(efficiency);
}

module.exports = {
  calculateStarPoints,
  calculatePayment,
  calculateRewards,
  getWasteTypes,
  isRewardable,
  calculateEfficiency,
  STAR_POINTS_RATES,
  PAYMENT_RATES,
  CONTAMINATION_PENALTY
};
