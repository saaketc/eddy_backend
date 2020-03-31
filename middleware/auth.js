const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    const token = req.header("x-auth-token");

    if (!token)
        return res.status(401).send("Please login to access");
    try {
        const decoded = jwt.verify(token, "jwtKeyForThinkinLoop");
        req.user = decoded;
        next();
    }
    catch (e) {
        return res.status(401).send("Please login with correct credentials");
    }
}

module.exports = auth;