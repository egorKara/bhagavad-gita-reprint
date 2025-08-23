// Test file for BugBot security detection
// This file contains intentional security issues for testing

// Security Issue #1: Hardcoded API key (should be flagged)
const apiKey = "sk_test_123456789abcdef_hardcoded_secret";
const dbPassword = "password123";

// Security Issue #2: Console statements in production (should be flagged)
function processUser(userData) {
    console.log("Processing user data:", userData); // Should be flagged
    console.error("Debug error info"); // Should be flagged
    
    return userData;
}

// Code Quality Issue #3: TODO comments (should be noted)
function fetchUserData() {
    // TODO: Implement caching mechanism
    // FIXME: This query is inefficient
    return database.query("SELECT * FROM users"); // Should suggest optimization
}

// Language Policy Issue #4: Non-English comments (should be flagged)
function calculateSum(numbers) {
    let sum = 0;
    // Проходим по всем числам и складываем их - Should be flagged
    for (let num of numbers) {
        sum += num;
    }
    return sum;
}

// Performance Issue #5: Potential memory leak (should be flagged)
let globalCache = {}; // Never cleaned up

function addToCache(key, value) {
    globalCache[key] = value; // Unbounded cache growth
}

// Good practice example (should pass)
const config = {
    apiKey: process.env.API_KEY,
    dbPassword: process.env.DB_PASSWORD
};

// Proper logging (should pass)
const logger = require('./logger');
function processUserCorrect(userData) {
    logger.info("Processing user data", { userId: userData.id });
    return userData;
}

module.exports = {
    processUser,
    fetchUserData,
    calculateSum,
    addToCache,
    processUserCorrect
};
