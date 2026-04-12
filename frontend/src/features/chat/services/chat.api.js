import axios from "axios"

const api = axios.create({
    baseURL: "http://localhost:3000",
    withCredentials: true
})

/**
 * @description Send a chat message to the backend.
 */
export const sendChatMessage = async ({ message, history, interviewId }) => {
    const endpoint = interviewId ? `/api/chat/${interviewId}` : "/api/chat"
    const response = await api.post(endpoint, {
        message,
        history
    })

    return response.data.response
}
