const jwt = require('jsonwebtoken');

// Authentication Middleware
function authenticate(req, res, next) {
    const token = req.header('Authorization');

    // if (!token) {
    //     return res.status(401).json({ message: 'Access denied. No token provided.' });
    // }

    // try {
    //     const decoded = jwt.verify(token, '0e71b9b989e2c3161037404a05b5d6638931fb02f384ea84b870d8a4317ec054');
    //     req.user = decoded;
        next();
    // } catch (error) {
    //     return res.status(400).json({ message: 'Invalid token.' });
    // }
}

module.exports = { 
    authenticate
};
