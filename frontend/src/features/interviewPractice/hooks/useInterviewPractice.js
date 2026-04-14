import { useState } from "react"
import { sendInterviewPracticeMessage } from "../services/interviewPractice.api"

export const useInterviewPractice = () => {
    const [ loading, setLoading ] = useState(false)

    const sendPracticeMessage = async ({ interviewId, message, history, question, resumeData }) => {
        setLoading(true)
        try {
            return await sendInterviewPracticeMessage({
                interviewId,
                message,
                history,
                question,
                resumeData
            })
        } finally {
            setLoading(false)
        }
    }

    return {
        loading,
        sendPracticeMessage
    }
}
