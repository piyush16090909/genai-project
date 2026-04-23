const userModel = require("../models/user.model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const tokenBlacklistModel = require("../models/blacklist.model")
const mongoose = require("mongoose")

function getAuthCookieOptions() {
    const configuredSecure = process.env.COOKIE_SECURE
    const secure = configuredSecure
        ? configuredSecure === "true"
        : process.env.NODE_ENV === "production"
    const sameSite = (process.env.COOKIE_SAME_SITE || (secure ? "none" : "lax")).toLowerCase()
    const cookieDomain = process.env.COOKIE_DOMAIN?.trim()
    const cookieOptions = {
        httpOnly: true,
        secure: sameSite === "none" ? true : secure,
        sameSite,
        maxAge: 24 * 60 * 60 * 1000
    }

    if (cookieDomain) {
        cookieOptions.domain = cookieDomain
    }

    return cookieOptions
}

function getAuthCookieClearOptions(cookieOptions) {
    const clearOptions = {
        httpOnly: cookieOptions.httpOnly,
        secure: cookieOptions.secure,
        sameSite: cookieOptions.sameSite
    }

    if (cookieOptions.domain) {
        clearOptions.domain = cookieOptions.domain
    }

    return clearOptions
}

const authCookieOptions = getAuthCookieOptions()

function ensureDatabaseConnected(res) {
    if (mongoose.connection.readyState !== 1) {
        res.status(503).json({
            message: "Database not connected. Please try again in a moment."
        })
        return false
    }
    return true
}

/**
 * @name registerUserController
 * @description register a new user, expects username, email and password in the request body
 * @access Public
 */
async function registerUserController(req, res) {
    if (!ensureDatabaseConnected(res)) {
        return
    }

    try {
        const { username, email, password } = req.body
        const normalizedUsername = String(username || "").trim()
        const normalizedEmail = String(email || "").trim().toLowerCase()

        if (!normalizedUsername || !normalizedEmail || !password) {
            return res.status(400).json({
                message: "Please provide username, email and password"
            })
        }

        const isUserAlreadyExists = await userModel.findOne({
            $or: [ { username: normalizedUsername }, { email: normalizedEmail } ]
        })

        if (isUserAlreadyExists) {
            return res.status(400).json({
                message: "Account already exists with this email address or username"
            })
        }

        const hash = await bcrypt.hash(password, 10)

        const user = await userModel.create({
            username: normalizedUsername,
            email: normalizedEmail,
            password: hash
        })

        const token = jwt.sign(
            { id: user._id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        )

        res.cookie("token", token, authCookieOptions)


        res.status(201).json({
            message: "User registered successfully",
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        })
    } catch (error) {
        console.error("Register failed:", error?.message || error)
        return res.status(500).json({
            message: "Registration failed. Please try again."
        })
    }

}


/**
 * @name loginUserController
 * @description login a user, expects email and password in the request body
 * @access Public
 */
async function loginUserController(req, res) {
    if (!ensureDatabaseConnected(res)) {
        return
    }

    try {
        const { email, username, identifier, password } = req.body
        const rawIdentifier = identifier || email || username
        const normalizedIdentifier = String(rawIdentifier || "").trim()

        if (!normalizedIdentifier || !password) {
            return res.status(400).json({
                message: "Please provide email or username and password"
            })
        }

        const user = await userModel.findOne({
            $or: [
                { email: normalizedIdentifier.toLowerCase() },
                { username: normalizedIdentifier }
            ]
        })

        if (!user) {
            return res.status(400).json({
                message: "Invalid email or password"
            })
        }

        const isPasswordValid = await bcrypt.compare(password, user.password)

        if (!isPasswordValid) {
            return res.status(400).json({
                message: "Invalid email or password"
            })
        }

        const token = jwt.sign(
            { id: user._id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        )

        res.cookie("token", token, authCookieOptions)
        res.status(200).json({
            message: "User loggedIn successfully.",
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        })
    } catch (error) {
        console.error("Login failed:", error?.message || error)
        return res.status(500).json({
            message: "Login failed. Please try again."
        })
    }
}


/**
 * @name logoutUserController
 * @description clear token from user cookie and add the token in blacklist
 * @access public
 */
async function logoutUserController(req, res) {
    const token = req.cookies.token

    if (token) {
        await tokenBlacklistModel.create({ token })
    }

    res.clearCookie("token", getAuthCookieClearOptions(authCookieOptions))

    res.status(200).json({
        message: "User logged out successfully"
    })
}

/**
 * @name getMeController
 * @description get the current logged in user details.
 * @access private
 */
async function getMeController(req, res) {

    const user = await userModel.findById(req.user.id)



    res.status(200).json({
        message: "User details fetched successfully",
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    })

}



module.exports = {
    registerUserController,
    loginUserController,
    logoutUserController,
    getMeController
}
