const Notifications = require("../src/models/notifications");
const BeamsServer = require("./pusher");
const { Io } = require("../src/socket");
const { getDateOfTimezone } = require("./cyphers");

const sendAdminNotification = async () => {

}

const sendUserNotification = async (user_id, params, options = {}) => {
    const {
        notify = true,
        notifySilently = false,
        channel_id = user_id,
        userData = null,
    } = options;
    const userNotification = await Notifications.findOneAndUpdate(
        { user_id },
        {
            $push: {
                notifications: {
                    $each: [{
                        ...params,
                        timestamp: getDateOfTimezone(params.timezone)
                    }],
                    $position: 0,
                    $slice: 30,
                }
            }
        },
        { upsert: true, new: true }
    );

    if (notify) Io().to(channel_id).emit('notification', {
        notify: !notifySilently,
        notification_data: userNotification,
        ...(userData && { user_data: userData })
    })

    const notificObj = {
        title: params.heading,
        body: params.mini_msg || params.message,
    }
    try {

        await BeamsServer.publishToInterests([user_id.toString()], {
            web: {
                notification: {
                    ...notificObj,
                    hide_notification_if_site_has_focus: false,
                    deep_link: "http://localhost:3000",
                }
            },
            apns: {
                aps: { alert: notificObj }
            },
            fcm: { notification: notificObj }
        })
    } catch (e) { console.log(e) }
}

module.exports = {
    sendAdminNotification,
    sendUserNotification
}