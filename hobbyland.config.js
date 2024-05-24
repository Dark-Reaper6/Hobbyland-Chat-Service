const allowedOrigins = ["http://localhost:3001", "http://localhost:3000"];

const adminRoles = ["administrator", "maintainer", "support"];

const hobbylandServers = ["hobbyland-root-server", "hobbyland-chat-server"];
const serverActionTypes = ["dispatch_event"];

const jwtExpiries = {
    default: 7, // 7 days
    extended: 30 // 30 days
}

const userLevels = {
    "0": 500,
    "1": 1000,
    "2": 3200,
    "3": 6400,
    "4": 18000,
    "5": 30000
}

const registerProviders = ["hobbyland", "google"];
const userNotificationTypes = ["account", "primary"];

const messageTypes = ["message", "announcement", "tooltip"];

const userDocsTypes = ['id_card', 'passport', "driver_license", 'other'];

const docsVerificStatuses = ["pending", "verified", "unverified"];

module.exports = {
    adminRoles,
    userLevels,
    jwtExpiries,
    messageTypes,
    userDocsTypes,
    allowedOrigins,
    hobbylandServers,
    registerProviders,
    serverActionTypes,
    docsVerificStatuses,
    userNotificationTypes
}