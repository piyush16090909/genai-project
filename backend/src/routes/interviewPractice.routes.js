const express = require("express")
const authMiddleware = require("../middlewares/auth.middleware")
const { interviewPracticeController } = require("../controllers/interviewPractice.controller")

const interviewPracticeRouter = express.Router()

/**
 * @route POST /api/interview-practice
 * @description Practice interview with AI agent using latest report context.
 * @access private
 */
interviewPracticeRouter.post("/", authMiddleware.authUser, interviewPracticeController)

/**
 * @route POST /api/interview-practice/:interviewId
 * @description Practice interview with AI agent using a selected interview report.
 * @access private
 */
interviewPracticeRouter.post("/:interviewId", authMiddleware.authUser, interviewPracticeController)

module.exports = interviewPracticeRouter
