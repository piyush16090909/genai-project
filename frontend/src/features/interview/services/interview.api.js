import api from "../../../services/apiClient.js"


/**
 * @description Service to generate interview report based on user self description, resume and job description.
 */
export const generateInterviewReport = async ({ jobDescription, selfDescription, resumeFile }) => {

    const formData = new FormData()
    formData.append("jobDescription", jobDescription)
    formData.append("selfDescription", selfDescription)
    if (resumeFile) {
        formData.append("resume", resumeFile)
    }

    const response = await api.post("/api/interview/", formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    })

    return response.data

}

/**
 * @description Service to update an existing interview report.
 */
export const updateInterviewReport = async ({ interviewId, jobDescription, selfDescription, resumeFile }) => {
    const formData = new FormData()
    formData.append("jobDescription", jobDescription)
    formData.append("selfDescription", selfDescription)
    if (resumeFile) {
        formData.append("resume", resumeFile)
    }

    const response = await api.put(`/api/interview/${interviewId}`, formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    })

    return response.data
}


/**
 * @description Service to get interview report by interviewId.
 */
export const getInterviewReportById = async (interviewId) => {
    const response = await api.get(`/api/interview/report/${interviewId}`)

    return response.data
}


/**
 * @description Service to get all interview reports of logged in user.
 */
export const getAllInterviewReports = async () => {
    const response = await api.get("/api/interview/")

    return response.data
}


/**
 * @description Service to generate resume pdf based on user self description, resume content and job description.
 */
export const generateResumePdf = async ({ interviewReportId }) => {
    const response = await api.post(`/api/interview/resume/pdf/${interviewReportId}`, null, {
        responseType: "blob"
    })

    return response
}

/**
 * @description Service to generate resume pdf with a selected template.
 */
export const generateResumePdfWithTemplate = async ({ interviewReportId, templateType, templateFile }) => {
    const formData = new FormData()
    formData.append("templateType", templateType || "default")
    if (templateFile) {
        formData.append("template", templateFile)
    }

    const response = await api.post(`/api/interview/resume/template/${interviewReportId}`, formData, {
        responseType: "blob",
        headers: {
            "Content-Type": "multipart/form-data"
        }
    })

    return response
}

/**
 * @description Service to regenerate roadmap based on desired days.
 */
export const regenerateRoadmap = async ({ interviewId, roadmapDays }) => {
    const response = await api.post(`/api/interview/roadmap/${interviewId}`, {
        roadmapDays
    })

    return response.data
}

/**
 * @description Service to delete an interview report by id.
 */
export const deleteInterviewReport = async (interviewId) => {
    const response = await api.delete(`/api/interview/${interviewId}`)

    return response.data
}
