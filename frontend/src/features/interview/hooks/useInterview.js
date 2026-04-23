import { getAllInterviewReports, generateInterviewReport, getInterviewReportById, generateResumePdf, regenerateRoadmap, deleteInterviewReport, updateInterviewReport } from "../services/interview.api"
import { useCallback, useContext, useEffect } from "react"
import { InterviewContext } from "../interview.context"
import { useParams } from "react-router"


export const useInterview = () => {

    const context = useContext(InterviewContext)
    const { interviewId } = useParams()

    if (!context) {
        throw new Error("useInterview must be used within an InterviewProvider")
    }

    const { loading, setLoading, report, setReport, reports, setReports } = context

    const generateReport = async ({ jobDescription, selfDescription, resumeFile, roadmapDays }) => {
        setLoading(true)
        try {
            const response = await generateInterviewReport({ jobDescription, selfDescription, resumeFile, roadmapDays })
            setReport(response.interviewReport)
            return response.interviewReport
        } catch (error) {
            console.log(error)
            const errorMessage = error?.response?.data?.message || "Failed to create interview plan."
            window.alert(errorMessage)
            return null
        } finally {
            setLoading(false)
        }
    }

    const editReport = async ({ interviewId, jobDescription, selfDescription, resumeFile }) => {
        setLoading(true)
        try {
            const response = await updateInterviewReport({ interviewId, jobDescription, selfDescription, resumeFile })
            setReport(response.interviewReport)
            setReports((prev) => prev.map((item) => item._id === interviewId ? response.interviewReport : item))
            return response.interviewReport
        } catch (error) {
            console.log(error)
            const errorMessage = error?.response?.data?.message || "Failed to update interview plan."
            window.alert(errorMessage)
            return null
        } finally {
            setLoading(false)
        }
    }

    const getReportById = useCallback(async (interviewId) => {
        setLoading(true)
        let response = null
        try {
            response = await getInterviewReportById(interviewId)
            setReport(response.interviewReport)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
        return response.interviewReport
    }, [ setLoading, setReport ])

    const getReports = useCallback(async () => {
        setLoading(true)
        let response = null
        try {
            response = await getAllInterviewReports()
            setReports(response.interviewReports)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }

        return response.interviewReports
    }, [ setLoading, setReports ])

    const getResumePdf = async (interviewReportId) => {
        setLoading(true)
        let response = null
        try {
            response = await generateResumePdf({ interviewReportId })
            const contentType = response.headers?.[ "content-type" ]

            if (!contentType || !contentType.includes("application/pdf")) {
                throw new Error("Resume download failed")
            }

            const url = window.URL.createObjectURL(new Blob([ response.data ], { type: contentType }))
            const link = document.createElement("a")
            link.href = url
            link.setAttribute("download", `resume_${interviewReportId}.pdf`)
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            window.URL.revokeObjectURL(url)
        }
        catch (error) {
            console.log(error)
            window.alert("Unable to download resume right now. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    const updateRoadmap = async ({ interviewId, roadmapDays }) => {
        setLoading(true)
        let response = null
        try {
            response = await regenerateRoadmap({ interviewId, roadmapDays })
            setReport(response.interviewReport)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }

        return response?.interviewReport
    }

    const deleteReport = async (interviewId) => {
        setLoading(true)
        try {
            await deleteInterviewReport(interviewId)
            setReports((prev) => prev.filter((item) => item._id !== interviewId))
            if (report?._id === interviewId) {
                setReport(null)
            }
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }


    useEffect(() => {
        if (interviewId) {
            getReportById(interviewId)
        } else {
            getReports()
        }
    }, [ interviewId, getReportById, getReports ])

    return { loading, report, reports, generateReport, editReport, getReportById, getReports, getResumePdf, updateRoadmap, deleteReport }

}
