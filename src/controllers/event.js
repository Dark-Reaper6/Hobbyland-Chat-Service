const { isValidObjectId } = require("mongoose");
const { Io } = require("../socket");
const jwt = require("jsonwebtoken");
const { serverActionTypes } = require("../../hobbyland.config");

const DispatchEvent = async (req, res) => {
    try {
        const { authorization } = req.headers;
        const authToken = authorization.split(" ")[1]
        if (authorization?.split(" ")[0] !== "Bearer" || !authToken) throw new Error("Invalid auth token.");
        const decodedToken = jwt.verify(authToken, process.env.APP_SECRET_KEY);
        const { server, action_type } = decodedToken;
        if ((process.env.SERVER_NAME !== server) || !serverActionTypes.includes(action_type)) throw new Error("Invalid auth token.");
    } catch (e) {
        console.log(e);
        return res.status(401).json({ success: false, msg: "Invalid server access token." })
    }

    const { user_id, event, data } = req.body;

    res.send('OK');
}

const DispatchLogout = async (req, res) => {
    try {
        console.log("The logout event api got called");
        const { authorization } = req.headers;
        const authToken = authorization.split(" ")[1]
        if (authorization?.split(" ")[0] !== "Bearer" || !authToken) throw new Error("Invalid auth token.");
        const decodedToken = jwt.verify(authToken, process.env.APP_SECRET_KEY);
        const { server, action_type } = decodedToken;
        if ((process.env.SERVER_NAME !== server) || !serverActionTypes.includes(action_type)) throw new Error("Invalid auth token.");
    } catch (e) {
        console.log(e);
        return res.status(401).json({ success: false, msg: "Invalid server access token." })
    }

    const { session_id } = req.body;
    console.log(session_id);

    const userSocket = Io().sockets.sockets.get(session_id);
    if (userSocket) userSocket.disconnect(true);
    console.log("Logout event successfull");

    return res.status(200).end();
}

module.exports = {
    DispatchEvent,
    DispatchLogout
};