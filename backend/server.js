require("dotenv").config()
const connectToDB = require("./src/config/database")
const app = require("./src/app")

async function startServer() {
    const isDbConnected = await connectToDB()
    const allowWithoutDb = process.env.ALLOW_SERVER_WITHOUT_DB === "true"

    if (!isDbConnected) {
        if (!allowWithoutDb) {
            console.error("Server startup aborted because database connection failed.")
            process.exit(1)
        }

        console.warn("Starting server without database because ALLOW_SERVER_WITHOUT_DB=true")
    }

    app.listen(3000, () => {
        console.log("Server is running on port 3000")
    })
}

startServer()