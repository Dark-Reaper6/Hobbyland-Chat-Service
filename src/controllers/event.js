const { isValidObjectId } = require("mongoose");
const jwt = require("jsonwebtoken");
const { hobbylandServers, serverActionTypes } = require("../../hobbyland.config");

const DispatchEvent = async (req, res) => {
    try {
        const { authorization } = req.headers;
        const authToken = authorization.split(" ")[1]
        if (authorization?.split(" ")[0] !== "Bearer" || !authToken) throw new Error("Invalid auth token.");
        const decodedToken = jwt.verify(authToken, process.env.APP_SECRET_KEY);
        const { server, action_type } = decodedToken;
        if (!hobbylandServers.includes(server) || !serverActionTypes.includes(action_type)) throw new Error("Invalid auth token.");
    } catch (e) {
        console.log(e);
        return res.status(401).json({ success: false, msg: "Invalid server access token." })
    }

    const { user_id,  } = req.body;

    res.send('OK');
}

module.exports = {
    DispatchEvent
};