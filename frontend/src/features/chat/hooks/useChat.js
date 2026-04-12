import { useState } from "react"
import { sendChatMessage } from "../services/chat.api"

export const useChat = () => {
    const [ loading, setLoading ] = useState(false)

    const sendMessage = async ({ message, history }) => {
        setLoading(true)
        try {
            const response = await sendChatMessage({ message, history })
            return response
        } finally {
            setLoading(false)
        }
    }

    return { loading, sendMessage }
}
