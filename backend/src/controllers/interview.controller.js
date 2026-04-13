const pdfParse = require("pdf-parse")
const { generateInterviewReport, generateResumePdf } = require("../services/ai.service")
const interviewReportModel = require("../models/interviewReport.model")




/**
 * @description Controller to generate interview report based on user self description, resume and job description.
 */
async function generateInterViewReportController(req, res) {
    let resumeText = ""
    if (req.file && req.file.buffer) {
        const resumeContent = await (new pdfParse.PDFParse(Uint8Array.from(req.file.buffer))).getText()
        resumeText = resumeContent.text
    }
    const { selfDescription, jobDescription, roadmapDays } = req.body
    const roadmapDaysNumber = roadmapDays ? Number(roadmapDays) : undefined

    const interViewReportByAi = await generateInterviewReport({
        resume: resumeText,
        selfDescription,
        jobDescription,
        roadmapDays: Number.isFinite(roadmapDaysNumber) ? roadmapDaysNumber : undefined
    })

    if (!Number.isFinite(roadmapDaysNumber)) {
        interViewReportByAi.preparationPlan = []
    }

    const interviewReport = await interviewReportModel.create({
        user: req.user.id,
        resume: resumeText,
        selfDescription,
        jobDescription,
        ...interViewReportByAi
    })

    res.status(201).json({
        message: "Interview report generated successfully.",
        interviewReport
    })

}

/**
 * @description Controller to get interview report by interviewId.
 */
async function getInterviewReportByIdController(req, res) {

    const { interviewId } = req.params

    const interviewReport = await interviewReportModel.findOne({ _id: interviewId, user: req.user.id })

    if (!interviewReport) {
        return res.status(404).json({
            message: "Interview report not found."
        })
    }

    res.status(200).json({
        message: "Interview report fetched successfully.",
        interviewReport
    })
}


/** 
 * @description Controller to get all interview reports of logged in user.
 */
async function getAllInterviewReportsController(req, res) {
    const interviewReports = await interviewReportModel.find({ user: req.user.id }).sort({ createdAt: -1 }).select("-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -preparationPlan")

    res.status(200).json({
        message: "Interview reports fetched successfully.",
        interviewReports
    })
}


/**
 * @description Controller to generate resume PDF based on user self description, resume and job description.
 */
async function generateResumePdfController(req, res) {
    try {
        const { interviewReportId } = req.params

        const interviewReport = await interviewReportModel.findById(interviewReportId)

        if (!interviewReport) {
            return res.status(404).json({
                message: "Interview report not found."
            })
        }

        const { resume, jobDescription, selfDescription } = interviewReport

        const pdfBuffer = await generateResumePdf({ resume, jobDescription, selfDescription })

        res.set({
            "Content-Type": "application/pdf",
            "Content-Disposition": `attachment; filename=resume_${interviewReportId}.pdf`
        })

        res.send(pdfBuffer)
    } catch (error) {
        console.error("Resume PDF generation failed", error)
        res.status(500).json({
            message: "Failed to generate resume PDF"
        })
    }
}

/**
 * @description Controller to regenerate roadmap based on desired days.
 */
async function regenerateRoadmapController(req, res) {
    const { interviewId } = req.params
    const { roadmapDays } = req.body
    const roadmapDaysNumber = roadmapDays ? Number(roadmapDays) : NaN

    if (!Number.isFinite(roadmapDaysNumber) || roadmapDaysNumber <= 0) {
        return res.status(400).json({
            message: "Roadmap days must be a positive number."
        })
    }

    const interviewReport = await interviewReportModel.findOne({ _id: interviewId, user: req.user.id })

    if (!interviewReport) {
        return res.status(404).json({
            message: "Interview report not found."
        })
    }

    const { resume, jobDescription, selfDescription } = interviewReport

    const interViewReportByAi = await generateInterviewReport({
        resume: resume || "",
        selfDescription: selfDescription || "",
        jobDescription: jobDescription || "",
        roadmapDays: roadmapDaysNumber
    })

    interviewReport.preparationPlan = interViewReportByAi.preparationPlan || []
    await interviewReport.save()

    res.status(200).json({
        message: "Roadmap updated successfully.",
        interviewReport
    })
}

/**
 * @description Controller to delete interview report by interviewId.
 */
async function deleteInterviewReportController(req, res) {
    const { interviewId } = req.params

    const deleted = await interviewReportModel.findOneAndDelete({ _id: interviewId, user: req.user.id })

    if (!deleted) {
        return res.status(404).json({
            message: "Interview report not found."
        })
    }

    res.status(200).json({
        message: "Interview report deleted successfully."
    })
}

/**
 * @description Controller to generate resume PDF using a template.
 */
async function generateResumePdfWithTemplateController(req, res) {
    try {
        const { interviewReportId } = req.params
        const { templateType } = req.body

        const interviewReport = await interviewReportModel.findById(interviewReportId)

        if (!interviewReport) {
            return res.status(404).json({
                message: "Interview report not found."
            })
        }

        let templateText = ""
        if (req.file && req.file.buffer) {
            const templateContent = await (new pdfParse.PDFParse(Uint8Array.from(req.file.buffer))).getText()
            templateText = templateContent.text || ""
        }

        if (templateText.length > 4000) {
            templateText = templateText.slice(0, 4000)
        }

        const { resume, jobDescription, selfDescription } = interviewReport

        const pdfBuffer = await generateResumePdf({
            resume,
            jobDescription,
            selfDescription,
            templateType: templateType || "default",
            templateText
        })

        interviewReport.resumeTemplateType = templateType || "default"
        await interviewReport.save()

        res.set({
            "Content-Type": "application/pdf",
            "Content-Disposition": `attachment; filename=resume_${interviewReportId}.pdf`
        })

        res.send(pdfBuffer)
    } catch (error) {
        console.error("Resume PDF generation failed", error)
        res.status(500).json({
            message: "Failed to generate resume PDF"
        })
    }
}

module.exports = {
    generateInterViewReportController,
    getInterviewReportByIdController,
    getAllInterviewReportsController,
    generateResumePdfController,
    regenerateRoadmapController,
    deleteInterviewReportController,
    generateResumePdfWithTemplateController
}