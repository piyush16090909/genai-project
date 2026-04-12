const axios = require("axios")
const puppeteer = require("puppeteer")
const AI_SERVICE_URL = process.env.AI_SERVICE_URL || "http://localhost:8001"
const AI_SERVICE_TIMEOUT_MS = Number(process.env.AI_SERVICE_TIMEOUT_MS) || 120000

async function postToAiService(path, payload) {
    try {
        const response = await axios.post(`${AI_SERVICE_URL}${path}`, payload, {
            timeout: AI_SERVICE_TIMEOUT_MS,
            headers: {
                "Content-Type": "application/json"
            }
        })

        return response.data
    } catch (error) {
        const status = error?.response?.status
        const detail = error?.response?.data?.detail || error?.message
        const code = error?.code
        const codeSuffix = code ? ` ${code}` : ""

        throw new Error(
            `AI service request failed${status ? ` (${status})` : ""}${codeSuffix}: ${detail}`
        )
    }
}

async function generateInterviewReport({ resume, selfDescription, jobDescription }) {
    return postToAiService("/interview-report", {
        resume,
        selfDescription,
        jobDescription
    })
}



async function generatePdfFromHtml(htmlContent) {
    const browser = await puppeteer.launch()
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: "networkidle0" })

    const pdfBuffer = await page.pdf({
        format: "A4", margin: {
            top: "20mm",
            bottom: "20mm",
            left: "15mm",
            right: "15mm"
        }
    })

    await browser.close()

    return pdfBuffer
}

async function generateResumePdf({ resume, selfDescription, jobDescription }) {
    const response = await postToAiService("/resume-html", {
        resume,
        selfDescription,
        jobDescription
    })

    if (!response?.html) {
        throw new Error("AI service response did not include HTML")
    }

    const pdfBuffer = await generatePdfFromHtml(response.html)

    return pdfBuffer

}

module.exports = { generateInterviewReport, generateResumePdf }