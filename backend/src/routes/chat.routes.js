const express = require("express")
const authMiddleware = require("../middlewares/auth.middleware")
const chatController = require("../controllers/chat.controller")

const chatRouter = express.Router()

/**
 * @route POST /api/chat
 * @description Chat with AI service.
 * @access private
 */
chatRouter.post("/", authMiddleware.authUser, chatController.chatController)
chatRouter.post("/:interviewId", authMiddleware.authUser, chatController.chatController)

module.exports = chatRouter
