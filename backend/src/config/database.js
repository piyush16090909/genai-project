const mongoose = require("mongoose")

mongoose.set("bufferCommands", false)


function attachConnectionLogs() {
    mongoose.connection.on("connected", () => {
        console.log("MongoDB connection state: connected")
    })

    mongoose.connection.on("disconnected", () => {
        console.error("MongoDB connection state: disconnected")
    })

    mongoose.connection.on("error", (err) => {
        console.error("MongoDB connection error:", err?.message || err)
    })
}


async function connectToDB() {
    const mongoUri = process.env.MONGO_URI

    if (!mongoUri) {
        console.error("MONGO_URI is missing. Add it to backend/.env")
        return false
    }

    try {
        attachConnectionLogs()

        await mongoose.connect(mongoUri, {
            serverSelectionTimeoutMS: 10000,
            connectTimeoutMS: 10000,
        })

        // Verify cluster reachability beyond initial socket negotiation.
        await mongoose.connection.db.admin().ping()

        console.log("Connected to Database")
        return true
    }
    catch (err) {
        const message = err?.message || "Unknown MongoDB connection error"
        console.error("MongoDB connection failed:", message)

        if (message.includes("whitelist") || message.includes("ReplicaSetNoPrimary")) {
            console.error("Atlas checklist:")
            console.error("1) Atlas -> Network Access: allow your current IP (or 0.0.0.0/0 for quick dev testing).")
            console.error("2) Atlas -> Database Access: verify username/password used in MONGO_URI.")
            console.error("3) If password has special chars, URL-encode it in MONGO_URI.")
            console.error("4) Confirm your cluster is not paused.")
        }

        return false
    }
}

module.exports = connectToDB