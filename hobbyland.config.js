const allowedOrigins = ["http://localhost:3001", "http://localhost:3000"];

const adminRoles = ["administrator", "maintainer", "support"]

const jwtExpiries = {
    default: 7, // 7 days
    extended: 30 // 30 days
}

const registerProviders = ["hobbyland", "google"];

const userDocsTypes = ['id_card', 'passport', "driver_license", 'other'];

const docsVerificStatuses = ["pending", "verified", "unverified"];

module.exports = {
    adminRoles,
    jwtExpiries,
    userDocsTypes,
    allowedOrigins,
    registerProviders,
    docsVerificStatuses
}