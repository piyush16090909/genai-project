const express = require("express")
const cookieParser = require("cookie-parser")
const cors = require("cors")

const app = express()

app.use(express.json())
app.use(cookieParser())
const allowedOrigins = (process.env.CORS_ORIGINS || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean)

function isLocalDevOrigin(origin) {
    try {
        const parsed = new URL(origin)
        return parsed.hostname === "localhost" || parsed.hostname === "127.0.0.1"
    } catch (_) {
        return false
    }
}

app.use(cors({
    origin: (origin, callback) => {
        // Allow non-browser tools and local dev frontends on localhost/127.0.0.1 (any port).
        if (!origin || isLocalDevOrigin(origin) || allowedOrigins.includes(origin)) {
            return callback(null, true)
        }

        return callback(null, false)
    },
    credentials: true
}))

/* require all the routes here */
const authRouter = require("./routes/auth.routes")
const interviewRouter = require("./routes/interview.routes")
const chatRouter = require("./routes/chat.routes")
const interviewPracticeRouter = require("./routes/interviewPractice.routes")


/* using all the routes here */
app.use("/api/auth", authRouter)
app.use("/api/interview", interviewRouter)
app.use("/api/chat", chatRouter)
app.use("/api/interview-practice", interviewPracticeRouter)



module.exports = app