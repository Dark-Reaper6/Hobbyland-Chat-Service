const mongoose = require('mongoose');

module.exports = async () => {
    if (mongoose.connections[0].readyState) return console.log("Success! Connection already exists\n");
    try {
        console.log("Connecting to the database...\n");
        await mongoose.connect(process.env.DATABASE_URI + process.env.DATABASE_NAME);
        console.log("✅ Connected to the MongoDB successfully!\n");
        return true;
    } catch (error) {
        console.error("❌ Error connecting to MongoDB:", error);
        return false;
    }
};

const immutableCondition = (doc) => {
    const { immutability } = doc.options;
    return !(immutability && immutability === "disable")
}

module.exports = { ConnectDB, immutableCondition }