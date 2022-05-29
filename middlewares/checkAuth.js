const jwt = require("jsonwebtoken");
const config = require("../configs/auth.json")
const { errorResponse } = require("../utility/errorHandler");

module.exports.auth = async (req, res, next) => {
    try {
        // Check if Authorization header is not provided
        if (!req.headers.authorization) {
            return errorResponse(res, "authorization header is not provided", 401);
        }

        const token = req.headers.authorization;
        const decoded = jwt.verify(token, config.auth_access_secret);
        req.userData = decoded;
        next();

    } catch (err) {
        console.error("***** Error in checkAccessToken middleware *****", err);
        return errorResponse(res, "Invalid Token !!", 404, { error: err });
    }
}