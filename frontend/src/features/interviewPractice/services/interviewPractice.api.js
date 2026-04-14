import axios from "axios"

const apiHost = typeof window !== "undefined" ? window.location.hostname : "localhost"
const apiPort = import.meta.env.VITE_API_PORT || "3000"
const apiProtocol = import.meta.env.VITE_API_PROTOCOL || "http"

const api = axios.create({
    baseURL: `${apiProtocol}://${apiHost}:${apiPort}`,
    withCredentials: true
})

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
