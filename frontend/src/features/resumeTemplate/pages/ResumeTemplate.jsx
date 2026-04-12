import React, { useEffect, useState } from "react"
import "../style/resumeTemplate.scss"
import { useNavigate, useParams } from "react-router"
import { getAllInterviewReports, generateResumePdfWithTemplate } from "../../interview/services/interview.api"

const TEMPLATE_OPTIONS = [
    { value: "default", label: "Default" },
    { value: "custom", label: "Upload Template" },
    { value: "classic", label: "Classic" },
    { value: "modern", label: "Modern" },
    { value: "compact", label: "Compact" },
    { value: "ats-friendly", label: "ATS-friendly" }
]

const ResumeTemplate = () => {
    const [ reports, setReports ] = useState([])
    const [ selectedReportId, setSelectedReportId ] = useState("")
    const [ templateType, setTemplateType ] = useState("default")
    const [ templateFile, setTemplateFile ] = useState(null)
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

    const handleTemplateChange = (value) => {
        setTemplateType(value)
        setError("")
        if (value !== "custom") {
            setTemplateFile(null)
        }
    }

    const handleFileChange = (event) => {
        const file = event.target.files?.[0]
        if (!file) {
            setTemplateFile(null)
            return
        }
        if (file.type !== "application/pdf") {
            setError("Please upload a PDF template.")
            event.target.value = ""
            return
        }
        setError("")
        setTemplateFile(file)
    }

    const handleGenerate = async () => {
        if (!selectedReportId) {
            setError("Please select an interview report.")
            return
        }
        if (templateType === "custom" && !templateFile) {
            setError("Please upload a PDF template.")
            return
        }

        setError("")
        setLoading(true)
        try {
            const response = await generateResumePdfWithTemplate({
                interviewReportId: selectedReportId,
                templateType,
                templateFile
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
                    <div>
                        <h1>Resume Templates</h1>
                        <p>Choose a template to generate your resume PDF.</p>
                    </div>
                    <div className="resume-template-actions">
                        <button type="button" onClick={() => navigate(-1)}>Back</button>
                        <button type="button" onClick={() => navigate("/")}>Home</button>
                    </div>
                </header>

                <div className="resume-template-body">
                    <label className="resume-template-label">Select interview report</label>
                    <select
                        value={selectedReportId}
                        onChange={(event) => setSelectedReportId(event.target.value)}
                    >
                        {reports.length === 0 && <option value="">No reports found</option>}
                        {reports.map((item) => (
                            <option key={item._id} value={item._id}>
                                {item.title || "Untitled Position"}
                            </option>
                        ))}
                    </select>

                    <label className="resume-template-label">Choose template</label>
                    <div className="resume-template-options">
                        {TEMPLATE_OPTIONS.map((option) => (
                            <button
                                key={option.value}
                                type="button"
                                className={`template-chip ${templateType === option.value ? "template-chip--active" : ""}`}
                                onClick={() => handleTemplateChange(option.value)}
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>

                    {templateType === "custom" && (
                        <div className="template-upload">
                            <label htmlFor="templateFile">Upload PDF template</label>
                            <input
                                id="templateFile"
                                type="file"
                                accept="application/pdf"
                                onChange={handleFileChange}
                            />
                        </div>
                    )}

                    {error && <p className="resume-template-error">{error}</p>}

                    <button
                        type="button"
                        className="resume-template-generate"
                        onClick={handleGenerate}
                        disabled={loading}
                    >
                        {loading ? "Generating..." : "Generate Resume"}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ResumeTemplate
