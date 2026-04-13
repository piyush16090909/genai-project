import React, { useEffect, useMemo, useRef, useState } from "react"
import "../style/chat.scss"
import { useChat } from "../hooks/useChat"
import { useNavigate, useParams } from "react-router"
import { getInterviewReportById } from "../../interview/services/interview.api"
import { parseChatbotOutput } from "../utils/chatResponseParser"

const QUICK_PROMPTS = [
    "How to answer Q2 about Gemini AI?",
    "Explain my skill gaps",
    "What should I study today?",
    "Mock interview Q&A"
]

const Chat = () => {
    const [ input, setInput ] = useState("")
    const [ messages, setMessages ] = useState([])
    const [ error, setError ] = useState("")
    const [ reportMeta, setReportMeta ] = useState(null)
    const listRef = useRef(null)
    const { interviewId } = useParams()
    const navigate = useNavigate()

    const { loading, sendMessage } = useChat()

    const handleSend = async () => {
        const trimmed = input.trim()
        if (!trimmed || loading) {
            return
        }

        setError("")
        const nextMessages = [ ...messages, { role: "user", content: trimmed } ]
        setMessages(nextMessages)
        setInput("")

        try {
            const response = await sendMessage({ message: trimmed, history: nextMessages, interviewId })
            setMessages((prev) => [ ...prev, { role: "assistant", content: parseChatbotOutput(response.reply) } ])
        } catch (err) {
            const detail = err?.response?.data?.message || err?.response?.data?.detail || err?.message
            setError(detail || "Unable to get a response right now.")
        }
    }

    const handleKeyDown = (event) => {
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault()
            handleSend()
        }
    }

    const renderedMessages = useMemo(() => messages, [ messages ])

    useEffect(() => {
        const loadMeta = async () => {
            if (!interviewId) {
                return
            }

            try {
                const response = await getInterviewReportById(interviewId)
                setReportMeta(response?.interviewReport || null)
            } catch {
                setReportMeta(null)
            }
        }

        loadMeta()
    }, [ interviewId ])

    useEffect(() => {
        if (listRef.current) {
            listRef.current.scrollTop = listRef.current.scrollHeight
        }
    }, [ renderedMessages, loading ])

    const handlePromptClick = (prompt) => {
        setInput(prompt)
    }

    return (
        <div className="chat-page">
            <div className="chat-card">
                <header className="chat-header">
                    <div className="chat-header__text">
                        <h1 onClick={() => navigate("/")}>PrepAI <span className="chat-header__dot">•</span></h1>
                        <p>Ask questions grounded in your latest interview report.</p>
                    </div>
                    <div className="chat-header__actions">
                        <button type="button" className="chat-action" onClick={() => navigate(-1)}>
                            Back
                        </button>
                        <button type="button" className="chat-action" onClick={() => navigate("/") }>
                            Home
                        </button>
                    </div>
                </header>

                <div className="chat-context-row">
                    <span className="chat-context-label">Context:</span>
                    <span className="chat-context-chip">Interview Report: {reportMeta?.title || "SDE-1 Role"}</span>
                    <span className="chat-context-chip">Match Score: {reportMeta?.matchScore ?? "--"}%</span>
                    <span className="chat-context-chip">{reportMeta?.skillGaps?.length || 0} Skill Gaps</span>
                </div>

                <div className="chat-messages" ref={listRef}>
                    {renderedMessages.length === 0 && (
                        <div className="chat-message chat-message--assistant">
                            <div className="chat-message__avatar">AI</div>
                            <div className="chat-message__content">
                                <div className="chat-message__bubble">
                                    Hi! I analyzed your interview report. I can help you practice questions, improve your weak areas, and plan what to study next.
                                </div>
                                <p className="chat-message__time">Just now</p>
                            </div>
                        </div>
                    )}
                    {renderedMessages.map((item, index) => (
                        <div key={`${item.role}-${index}`} className={`chat-message chat-message--${item.role}`}>
                            {item.role === "assistant" && <div className="chat-message__avatar">AI</div>}
                            <div className="chat-message__content">
                                <div className="chat-message__bubble">{item.content}</div>
                                <p className="chat-message__time">Just now</p>
                            </div>
                            {item.role === "user" && <div className="chat-message__avatar chat-message__avatar--user">PS</div>}
                        </div>
                    ))}
                </div>

                {error && <p className="chat-error">{error}</p>}

                <div className="chat-quick-prompts">
                    {QUICK_PROMPTS.map((prompt) => (
                        <button key={prompt} type="button" className="chat-quick-prompts__chip" onClick={() => handlePromptClick(prompt)}>
                            {prompt}
                        </button>
                    ))}
                </div>

                <div className="chat-input">
                    <textarea
                        value={input}
                        onChange={(event) => setInput(event.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Ask anything about your interview report..."
                        rows={1}
                    />
                    <button type="button" onClick={handleSend} disabled={loading}>
                        {loading ? "Sending..." : "Send"}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Chat
