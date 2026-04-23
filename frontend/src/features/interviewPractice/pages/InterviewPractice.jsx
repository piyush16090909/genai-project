import React, { useEffect, useMemo, useRef, useState } from "react"
import { useNavigate, useParams } from "react-router"
import { useInterviewPractice } from "../hooks/useInterviewPractice"
import { getInterviewReportById } from "../../interview/services/interview.api"
import "../style/interviewPractice.scss"

const START_PROMPT = "Start an interview practice session based on my profile."

function parseEvaluation(rawEvaluation) {
    if (!rawEvaluation) {
        return null
    }

    if (typeof rawEvaluation === "object") {
        return rawEvaluation
    }

    if (typeof rawEvaluation !== "string") {
        return null
    }

    let cleaned = rawEvaluation.trim()

    if (cleaned.startsWith("```")) {
        cleaned = cleaned.replace(/^```(?:json)?\s*/i, "")
        cleaned = cleaned.replace(/\s*```$/, "")
    }

    try {
        const parsed = JSON.parse(cleaned)
        return parsed && typeof parsed === "object" ? parsed : null
    } catch {
        return null
    }
}

const InterviewPractice = () => {
    const [ input, setInput ] = useState("")
    const [ messages, setMessages ] = useState([])
    const [ currentQuestion, setCurrentQuestion ] = useState("")
    const [ resumeData, setResumeData ] = useState({})
    const [ latestEvaluation, setLatestEvaluation ] = useState("")
    const [ error, setError ] = useState("")
    const [ reportMeta, setReportMeta ] = useState(null)

    const listRef = useRef(null)
    const navigate = useNavigate()
    const { interviewId } = useParams()
    const { loading, sendPracticeMessage } = useInterviewPractice()

    const renderedMessages = useMemo(() => messages, [ messages ])
    const parsedEvaluation = useMemo(() => parseEvaluation(latestEvaluation), [ latestEvaluation ])

    useEffect(() => {
        const loadMeta = async () => {
            if (!interviewId) {
                setReportMeta(null)
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

    const syncScroll = () => {
        setTimeout(() => {
            if (listRef.current) {
                listRef.current.scrollTop = listRef.current.scrollHeight
            }
        }, 0)
    }

    const send = async (messageToSend) => {
        const trimmed = String(messageToSend || "").trim()
        if (!trimmed || loading) {
            return
        }

        setError("")

        try {
            const response = await sendPracticeMessage({
                interviewId,
                message: trimmed,
                history: renderedMessages,
                question: currentQuestion,
                resumeData
            })

            if (Array.isArray(response?.history)) {
                setMessages(response.history)
            }

            setCurrentQuestion(response?.question || "")
            setLatestEvaluation(response?.evaluation || "")

            if (response?.resume_data && typeof response.resume_data === "object") {
                setResumeData(response.resume_data)
            }

            setInput("")
            syncScroll()
        } catch (err) {
            setError(err?.response?.data?.message || err?.message || "Failed to send practice message.")
        }
    }

    const handleKeyDown = (event) => {
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault()
            send(input)
        }
    }

    return (
        <div className="practice-page">
            <div className="practice-card">
                <header className="practice-header">
                    <div className="practice-header__text">
                        <h1 onClick={() => navigate("/")}>PrepAI <span className="practice-header__dot">&bull;</span></h1>
                        <p>Ask questions grounded in your latest interview report.</p>
                    </div>
                    <div className="practice-header__actions">
                        <button type="button" onClick={() => navigate(-1)}>Back</button>
                        <button type="button" onClick={() => navigate("/")}>Home</button>
                    </div>
                </header>

                <div className="practice-context-row">
                    <span className="practice-context-label">Context:</span>
                    <span className="practice-context-chip">Interview Report: {reportMeta?.title || "SDE-1 Role"}</span>
                    <span className="practice-context-chip">Match Score: {reportMeta?.matchScore ?? "--"}%</span>
                    <span className="practice-context-chip">{reportMeta?.skillGaps?.length || 0} Skill Gaps</span>
                </div>

                {renderedMessages.length === 0 && (
                    <section className="practice-empty">
                        <p>Ready to start your mock interview?</p>
                        <button type="button" disabled={loading} onClick={() => send(START_PROMPT)}>
                            {loading ? "Starting..." : "Start Practice"}
                        </button>
                    </section>
                )}

                {renderedMessages.length > 0 && (
                    <section className="practice-messages" ref={listRef}>
                        {renderedMessages.map((item, idx) => (
                            <article key={`${item.role}-${idx}`} className={`practice-msg practice-msg--${item.role}`}>
                                <span className="practice-msg__role">{item.role === "assistant" ? "Agent" : "You"}</span>
                                <p>{item.content}</p>
                            </article>
                        ))}
                    </section>
                )}

                {latestEvaluation && (
                    <section className="practice-eval">
                        <h2>Last Answer Feedback</h2>
                        {parsedEvaluation ? (
                            <div>
                                <p><strong>Score:</strong> {parsedEvaluation.score ?? "N/A"}</p>
                                <p><strong>Strengths:</strong></p>
                                <ul>
                                    {(Array.isArray(parsedEvaluation.strengths) ? parsedEvaluation.strengths : []).map((item, idx) => (
                                        <li key={`strength-${idx}`}>{item}</li>
                                    ))}
                                </ul>
                                <p><strong>Improvements:</strong></p>
                                <ul>
                                    {(Array.isArray(parsedEvaluation.improvements) ? parsedEvaluation.improvements : []).map((item, idx) => (
                                        <li key={`improvement-${idx}`}>{item}</li>
                                    ))}
                                </ul>
                            </div>
                        ) : (
                            <pre>{latestEvaluation}</pre>
                        )}
                    </section>
                )}

                {error && <p className="practice-error">{error}</p>}

                <footer className="practice-input">
                    <textarea
                        value={input}
                        onChange={(event) => setInput(event.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={renderedMessages.length === 0 ? "Click Start Practice first" : "Type your interview answer..."}
                        rows={3}
                        disabled={loading || renderedMessages.length === 0}
                    />
                    <button
                        type="button"
                        disabled={loading || !input.trim() || renderedMessages.length === 0}
                        onClick={() => send(input)}
                    >
                        {loading ? "Sending..." : "Send Answer"}
                    </button>
                </footer>
            </div>
        </div>
    )
}

export default InterviewPractice
