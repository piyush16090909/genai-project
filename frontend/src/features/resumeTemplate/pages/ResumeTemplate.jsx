import React, { useEffect, useState } from "react"
import "../style/resumeTemplate.scss"
import { useNavigate, useParams } from "react-router"
import { getAllInterviewReports, generateResumePdfWithTemplate } from "../../interview/services/interview.api"

const TEMPLATE_OPTIONS = [
    { value: "default", label: "Default", tone: "template-tile--default" },
    { value: "classic", label: "Classic", tone: "template-tile--classic" },
    { value: "modern", label: "Modern", tone: "template-tile--modern" },
    { value: "compact", label: "Compact", tone: "template-tile--compact" },
    { value: "ats-friendly", label: "ATS-Friendly", tone: "template-tile--ats" }
]

const ResumeTemplate = () => {
    const [ reports, setReports ] = useState([])
    const [ selectedReportId, setSelectedReportId ] = useState("")
    const [ templateType, setTemplateType ] = useState("default")
    const [ error, setError ] = useState("")
    const [ loading, setLoading ] = useState(false)
    const { interviewId } = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        const loadReports = async () => {
            try {
                const response = await getAllInterviewReports()
                const list = response.interviewReports || []
                setReports(list)
                if (interviewId) {
                    setSelectedReportId(interviewId)
                } else if (list.length > 0) {
                    setSelectedReportId(list[0]._id)
                }
            } catch (err) {
                setError("Unable to load interview reports.")
            }
        }

        loadReports()
    }, [ interviewId ])

    const handleGenerate = async () => {
        if (!selectedReportId) {
            setError("Please select an interview report.")
            return
        }

        setError("")
        setLoading(true)
        try {
            const response = await generateResumePdfWithTemplate({
                interviewReportId: selectedReportId,
                templateType,
                templateFile: null
            })

            const contentType = response.headers?.["content-type"]
            if (!contentType || !contentType.includes("application/pdf")) {
                throw new Error("Resume download failed")
            }

            const url = window.URL.createObjectURL(new Blob([ response.data ], { type: contentType }))
            const link = document.createElement("a")
            link.href = url
            link.setAttribute("download", `resume_${selectedReportId}.pdf`)
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            window.URL.revokeObjectURL(url)
        } catch (err) {
            setError("Unable to generate resume right now.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="resume-template-page">
            <div className="resume-template-card">
                <header className="resume-template-header">
                    <div className="resume-template-header__copy">
                        <h1 onClick={() => navigate("/")}>PrepAI</h1>
                        <p>Choose a template to generate your tailored resume PDF</p>
                    </div>
                    <div className="resume-template-actions">
                        <button type="button" onClick={() => navigate(-1)}>&larr; Back</button>
                        <button type="button" onClick={() => navigate("/")}>Home</button>
                    </div>
                </header>

                <div className="resume-template-body">
                    <label className="resume-template-label">Select interview report</label>
                    <div className="resume-template-select-wrap">
                        <select
                            value={selectedReportId}
                            onChange={(event) => setSelectedReportId(event.target.value)}
                        >
                            {reports.length === 0 && <option value="">No reports found</option>}
                            {reports.map((item) => (
                                <option key={item._id} value={item._id}>
                                    Interview Report for {item.username || "Candidate"} - {item.title || "SDE-1 Role"}
                                </option>
                            ))}
                        </select>
                    </div>

                    <label className="resume-template-label">Choose template</label>
                    <div className="resume-template-options resume-template-options--tiles">
                        {TEMPLATE_OPTIONS.map((option) => (
                            <button
                                key={option.value}
                                type="button"
                                className={`template-tile ${option.tone} ${templateType === option.value ? "template-tile--active" : ""}`}
                                onClick={() => setTemplateType(option.value)}
                            >
                                <span className="template-tile__preview" aria-hidden="true">
                                    <span />
                                    <span />
                                    <span />
                                </span>
                                <span className="template-tile__name">{option.label}</span>
                            </button>
                        ))}
                    </div>

                    {error && <p className="resume-template-error">{error}</p>}

                    <button
                        type="button"
                        className="resume-template-generate"
                        onClick={handleGenerate}
                        disabled={loading}
                    >
                        {loading ? "Generating..." : "Generate Resume PDF"}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ResumeTemplate
