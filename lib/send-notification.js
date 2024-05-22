const Notifications = require("../src/models/notifications");
const BeamsServer = require("./pusher");
const { Io } = require("../src/socket");

const sendAdminNotification = async () => {

}

const sendUserNotification = async (user_id, params, options = {}) => {
    const {
        notify = true,
        notifySilently = false,
        userData = null,
    } = options;
    const userNotification = await Notifications.findOneAndUpdate(
        { user_id },
        {
            $push: {
                notifications: {
                    $each: [{
                        ...params,
                        timestamp: new Date()
                    }],
                    $position: 0,
                    $slice: 20,
                }
            }
        },
        { upsert: true, new: true }
    );

    if (notify) Io().to(user_id).emit('notification', {
        notification_data: userNotification,
        ...(userData && { user_data: userData })
    })

    const notificObj = {
        title: params.heading,
        body: params.mini_msg || params.message,
    }
    // await BeamsServer.publishToInterests([user_id.toString()], {
    //     web: {
    //         notification: {
    //             ...notificObj,
    //             hide_notification_if_site_has_focus: false,
    //             deep_link: process.env.NEXT_PUBLIC_HOST,
    //         }
    //     }
    //     // apns: {
    //     //     aps: { alert: notificObj }
    //     // },
    //     // fcm: { notification: notificObj }
    // })
}

module.exports = {
    sendAdminNotification,
    sendUserNotification
}