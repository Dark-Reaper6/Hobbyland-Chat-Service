
// const { Io } = require("../socket/index");
const StandardApi = require("../middlewares/standard-api");
const { sendUserNotification } = require("../../lib/send-notification");
const { getDateOfTimezone } = require("../../lib/cyphers");

module.exports = async (req, res) => StandardApi(req, res, async () => {
    const user_id = req.user._id;
    const date = getDateOfTimezone(req.user.timezone)

    await sendUserNotification(user_id, {
        category: "account",
        heading: "Login",
        mini_msg: `You logged in to your Hobbyland account at ${date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear()} ${date.getHours() + ":" + date.getMinutes()}`,
        message: `You logged in to your Hobbyland account through whatever.`
    }, { notify: true })
    return res.json({ success: true, msg: "Test event triggered, listen to the `test-event` on client side." })
})