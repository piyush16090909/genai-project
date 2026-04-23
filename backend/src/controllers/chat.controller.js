const mongoose = require("mongoose")
const { chatWithAi } = require("../services/ai.service")
const interviewReportModel = require("../models/interviewReport.model")

/**
 * @description Controller to chat with AI service.
 */
async function chatController(req, res) {
    try {
        const { message, history } = req.body
        const interviewId = req.params.interviewId || req.body.interviewId

        if (!message || !message.trim()) {
            return res.status(400).json({
                message: "Message is required."
            })
        }

        let context = undefined
        let interviewReport = null

        if (interviewId) {
            if (!mongoose.isValidObjectId(interviewId)) {
                return res.status(400).json({
                    message: "Interview id is invalid."
                })
            }

            interviewReport = await interviewReportModel.findOne({ _id: interviewId, user: req.user.id })

            if (!interviewReport) {
                return res.status(404).json({
                    message: "Interview report not found."
                })
            }
        } else {
            interviewReport = await interviewReportModel
                .findOne({ user: req.user.id })
                .sort({ createdAt: -1 })
        }

        if (!interviewReport) {
            return res.status(404).json({
                message: "No interview reports found for this user."
            })
        }

        context = {
            title: interviewReport.title || "",
            resume: interviewReport.resume || "",
            selfDescription: interviewReport.selfDescription || "",
            jobDescription: interviewReport.jobDescription || ""
        }

        const response = await chatWithAi({ message, history, context })

        res.status(200).json({
            message: "Chat response generated successfully.",
            response
        })
    } catch (error) {
        console.error("Chat failed:", error?.message || error)
        return res.status(500).json({
            message: error?.message || "Chat request failed."
        })
    }
}

module.exports = { chatController }
