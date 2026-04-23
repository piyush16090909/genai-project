import api from "../../../services/apiClient.js"

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
