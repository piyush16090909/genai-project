const mongoose = require("mongoose")
const interviewReportModel = require("../models/interviewReport.model")
const { practiceInterview } = require("../services/ai.service")

/**
 * @description Controller for interactive interview practice with AI agent.
 */
async function interviewPracticeController(req, res) {
    try {
        const { message, history, question, resumeData } = req.body
        const interviewId = req.params.interviewId || req.body.interviewId

        if (!message || !String(message).trim()) {
            return res.status(400).json({
                message: "Message is required."
            })
        }

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

        const resumeContext = interviewReport.resume
            || `${interviewReport.selfDescription || ""}\n${interviewReport.jobDescription || ""}`.trim()

        const response = await practiceInterview({
            message: String(message).trim(),
            history: Array.isArray(history) ? history : [],
            question: typeof question === "string" ? question : "",
            resume: resumeContext,
            resume_data: resumeData && typeof resumeData === "object" ? resumeData : {}
        })

        return res.status(200).json({
            message: "Interview practice response generated successfully.",
            practice: response
        })
    } catch (error) {
        console.error("Interview practice failed:", error?.message || error)
        return res.status(500).json({
            message: "Interview practice failed. Please try again."
        })
    }
}

module.exports = { interviewPracticeController }
