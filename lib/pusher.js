const PushNotifications = require("@pusher/push-notifications-server");

const BeamsServer = new PushNotifications({
    instanceId: process.env.PUSHER_INSTANCE_ID,
    secretKey: process.env.PUSHER_PRIMARY_KEY
});
module.exports = BeamsServer;