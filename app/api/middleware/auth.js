const jwt = require('jsonwebtoken');
const config = require('config');
 
module.exports = function (req, res, next) {
    const token = req.header('x-auth-token');
    if (!token) {
        return res.status(401).json({
            status: 'failed',
            message: 'Access denied. No JWT provided.'
        });
    }
 
    try {
        const decoded = jwt.verify(token, config.get('PrivateKey'));
        req.user = decoded;
        next();
    }
    catch (err) {
        res.status(400).json({
            status: 'failed',
            message: 'Invalid JWT.'
        });
    }
}