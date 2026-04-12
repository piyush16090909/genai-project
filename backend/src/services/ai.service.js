const { z } = require("zod")
const puppeteer = require("puppeteer")

let mistralClientPromise = null

async function getMistralClient() {
    if (!mistralClientPromise) {
        mistralClientPromise = import("@mistralai/mistralai").then(({ Mistral }) => {
            if (!process.env.MISTRAL_API_KEY) {
                throw new Error("MISTRAL_API_KEY is not set")
            }

            return new Mistral({ apiKey: process.env.MISTRAL_API_KEY, timeoutMs: getTimeoutMs() })
        })
    }

    return mistralClientPromise
}

function getModelName() {
    return process.env.MISTRAL_MODEL || "mistral-large-2512"
}

function getTimeoutMs() {
    const rawValue = process.env.MISTRAL_TIMEOUT_MS
    const parsedValue = Number(rawValue)

    if (Number.isFinite(parsedValue) && parsedValue > 0) {
        return parsedValue
    }

    return 120000
}


const interviewReportSchema = z.object({
    matchScore: z.number().describe("A score between 0 and 100 indicating how well the candidate's profile matches the job describe"),
    technicalQuestions: z.array(z.object({
        question: z.string().describe("The technical question can be asked in the interview"),
        intention: z.string().describe("The intention of interviewer behind asking this question"),
        answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
    })).describe("Technical questions that can be asked in the interview along with their intention and how to answer them"),
    behavioralQuestions: z.array(z.object({
        question: z.string().describe("The technical question can be asked in the interview"),
        intention: z.string().describe("The intention of interviewer behind asking this question"),
        answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
    })).describe("Behavioral questions that can be asked in the interview along with their intention and how to answer them"),
    skillGaps: z.array(z.object({
        skill: z.string().describe("The skill which the candidate is lacking"),
        severity: z.enum([ "low", "medium", "high" ]).describe("The severity of this skill gap, i.e. how important is this skill for the job and how much it can impact the candidate's chances")
    })).describe("List of skill gaps in the candidate's profile along with their severity"),
    preparationPlan: z.array(z.object({
        day: z.number().describe("The day number in the preparation plan, starting from 1"),
        focus: z.string().describe("The main focus of this day in the preparation plan, e.g. data structures, system design, mock interviews etc."),
        tasks: z.array(z.string()).describe("List of tasks to be done on this day to follow the preparation plan, e.g. read a specific book or article, solve a set of problems, watch a video etc.")
    })).describe("A day-wise preparation plan for the candidate to follow in order to prepare for the interview effectively"),
    title: z.string().describe("The title of the job for which the interview report is generated"),
})

async function generateInterviewReport({ resume, selfDescription, jobDescription }) {


    const prompt = `Generate an interview report for a candidate with the following details:
                        Resume: ${resume}
                        Self Description: ${selfDescription}
                        Job Description: ${jobDescription}
`

    const mistral = await getMistralClient()

    const response = await mistral.chat.parse({
        model: getModelName(),
        messages: [
            {
                role: "system",
                content: "Return only structured data that matches the requested schema."
            },
            {
                role: "user",
                content: prompt
            }
        ],
        responseFormat: interviewReportSchema
    }, { timeoutMs: getTimeoutMs() })

    const parsed = response.choices?.[ 0 ]?.message?.parsed

    if (!parsed) {
        throw new Error("Mistral response was empty")
    }

    return parsed


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

    const resumePdfSchema = z.object({
        html: z.string().describe("The HTML content of the resume which can be converted to PDF using any library like puppeteer")
    })

    const prompt = `Generate resume for a candidate with the following details:
                        Resume: ${resume}
                        Self Description: ${selfDescription}
                        Job Description: ${jobDescription}

                        the response should be a JSON object with a single field "html" which contains the HTML content of the resume which can be converted to PDF using any library like puppeteer.
                        The resume should be tailored for the given job description and should highlight the candidate's strengths and relevant experience. The HTML content should be well-formatted and structured, making it easy to read and visually appealing.
                        The content of resume should be not sound like it's generated by AI and should be as close as possible to a real human-written resume.
                        you can highlight the content using some colors or different font styles but the overall design should be simple and professional.
                        The content should be ATS friendly, i.e. it should be easily parsable by ATS systems without losing important information.
                        The resume should not be so lengthy, it should ideally be 1-2 pages long when converted to PDF. Focus on quality rather than quantity and make sure to include all the relevant information that can increase the candidate's chances of getting an interview call for the given job description.
                    `

    const mistral = await getMistralClient()

    const response = await mistral.chat.parse({
        model: getModelName(),
        messages: [
            {
                role: "system",
                content: "Return only structured data that matches the requested schema."
            },
            {
                role: "user",
                content: prompt
            }
        ],
        responseFormat: resumePdfSchema
    }, { timeoutMs: getTimeoutMs() })

    const jsonContent = response.choices?.[ 0 ]?.message?.parsed

    if (!jsonContent?.html) {
        throw new Error("Mistral response did not include HTML")
    }

    const pdfBuffer = await generatePdfFromHtml(jsonContent.html)

    return pdfBuffer

}

module.exports = { generateInterviewReport, generateResumePdf }