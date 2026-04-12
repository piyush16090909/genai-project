import React, { useMemo, useRef, useState } from "react"
import "../style/chat.scss"
import { useChat } from "../hooks/useChat"
import { useNavigate, useParams } from "react-router"

const Chat = () => {
    const [ input, setInput ] = useState("")
    const [ messages, setMessages ] = useState([])
    const [ error, setError ] = useState("")
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
            setMessages((prev) => [ ...prev, { role: "assistant", content: response.reply } ])
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

    return (
        <div className="chat-page">
            <div className="chat-card">
                <header className="chat-header">
                    <div className="chat-header__text">
                        <h1>AI Chatbot</h1>
                        <p>Ask questions grounded in your latest interview report.</p>
                    </div>
                    <div className="chat-header__actions">
                        <button type="button" className="chat-action" onClick={() => navigate(-1)}>
                            <svg viewBox="0 0 24 24" aria-hidden="true">
                                <path d="M15 6l-6 6 6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            Back
                        </button>
                        <button type="button" className="chat-action" onClick={() => navigate("/") }>
                            <svg viewBox="0 0 24 24" aria-hidden="true">
                                <path d="M3 11l9-8 9 8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M5 10v10h14V10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            Home
                        </button>
                    </div>
                </header>

                <div className="chat-messages" ref={listRef}>
                    {renderedMessages.length === 0 && (
                        <div className="chat-empty">
                            <p>No messages yet. Start the conversation.</p>
                        </div>
                    )}
                    {renderedMessages.map((item, index) => (
                        <div key={`${item.role}-${index}`} className={`chat-message chat-message--${item.role}`}>
                            <div className="chat-message__bubble">{item.content}</div>
                        </div>
                    ))}
                </div>

                {error && <p className="chat-error">{error}</p>}

                <div className="chat-input">
                    <textarea
                        value={input}
                        onChange={(event) => setInput(event.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Type your message..."
                        rows={2}
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
