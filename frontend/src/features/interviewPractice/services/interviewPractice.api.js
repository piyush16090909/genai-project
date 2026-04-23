import api from "../../../services/apiClient.js"

export const sendInterviewPracticeMessage = async ({ interviewId, message, history, question, resumeData }) => {
    const endpoint = interviewId ? `/api/interview-practice/${interviewId}` : "/api/interview-practice"
    const response = await api.post(endpoint, {
        message,
        history,
        question,
        resumeData
    })

    return response.data.practice
}
