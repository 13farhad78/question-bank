// db.js
const mongoose = require("mongoose");

async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            dbName: process.env.MONGODB_DB, // اسم دیتابیس رو از env می‌گیره
        });
        console.log("✅ Connected to MongoDB Atlas");
    } catch (err) {
        console.error("❌ Mongo connection error:", err.message);
        process.exit(1);
    }
}

module.exports = connectDB;
