import React, { useEffect, useState } from 'react'
import "../style/home.scss"
import { useInterview } from '../hooks/useInterview.js'
import { useAuth } from '../../auth/hooks/useAuth.js'
import { useNavigate } from 'react-router'
import GlobalThemeToggle from '../../../theme/GlobalThemeToggle.jsx'

const Home = () => {

    const { loading, generateReport, editReport, reports, deleteReport, getReportById } = useInterview()
    const { handleLogout } = useAuth()
    const [ jobDescription, setJobDescription ] = useState("")
    const [ selfDescription, setSelfDescription ] = useState("")
    const [ resumeFile, setResumeFile ] = useState(null)
    const [ resumeError, setResumeError ] = useState("")
    const [ formError, setFormError ] = useState("")
    const [ openMenuReportId, setOpenMenuReportId ] = useState(null)
    const [ editingReportId, setEditingReportId ] = useState(null)
    const [ editingHasResume, setEditingHasResume ] = useState(false)
    const [ isCreating, setIsCreating ] = useState(false)
    const [ deleteConfirmReport, setDeleteConfirmReport ] = useState(null)

    const navigate = useNavigate()

    useEffect(() => {
        const handleWindowClick = () => {
            setOpenMenuReportId(null)
        }

        window.addEventListener("click", handleWindowClick)

        return () => {
            window.removeEventListener("click", handleWindowClick)
        }
    }, [])

    useEffect(() => {
        if (!deleteConfirmReport) {
            return undefined
        }

        const handleEscape = (event) => {
            if (event.key === "Escape") {
                setDeleteConfirmReport(null)
            }
        }

        window.addEventListener("keydown", handleEscape)

        return () => {
            window.removeEventListener("keydown", handleEscape)
        }
    }, [ deleteConfirmReport ])

    const resetPlanForm = () => {
        setJobDescription("")
        setSelfDescription("")
        setResumeFile(null)
        setResumeError("")
        setFormError("")
        setOpenMenuReportId(null)
        setEditingReportId(null)
        setEditingHasResume(false)
    }

    const openCreatePlan = () => {
        resetPlanForm()
        setIsCreating(true)
    }

    const closeCreatePlan = () => {
        resetPlanForm()
        setIsCreating(false)
    }

    const handleSubmitReport = async () => {
        const hasResumeContent = Boolean(resumeFile || editingHasResume)

        if (!hasResumeContent && !selfDescription.trim()) {
            setFormError("Please provide a resume or a short self description.")
            return
        }

        setFormError("")

        const data = editingReportId
            ? await editReport({ interviewId: editingReportId, jobDescription, selfDescription, resumeFile })
            : await generateReport({ jobDescription, selfDescription, resumeFile })

        if (!data?._id) {
            setFormError(editingReportId
                ? "Interview plan could not be updated. Please check backend database connection and try again."
                : "Interview plan could not be created. Please check backend database connection and try again.")
            return
        }

        resetPlanForm()
        navigate('/interview/' + data._id)
    }

    const handleLogoutClick = async () => {
        await handleLogout()
        navigate('/login')
    }

    const handleDeleteReport = (e, report) => {
        e.stopPropagation()
        setOpenMenuReportId(null)
        setDeleteConfirmReport(report)
    }

    const handleConfirmDeleteReport = async () => {
        if (!deleteConfirmReport?._id) {
            return
        }

        await deleteReport(deleteConfirmReport._id)
        setDeleteConfirmReport(null)
    }

    const handleEditReport = async (e, interviewId) => {
        e.stopPropagation()
        setOpenMenuReportId(null)

        const report = await getReportById(interviewId)

        if (!report?._id) {
            window.alert("Unable to load this interview plan for editing.")
            return
        }

        setJobDescription(report.jobDescription || "")
        setSelfDescription(report.selfDescription || "")
        setResumeFile(null)
        setResumeError("")
        setFormError("")
        setEditingReportId(report._id)
        setEditingHasResume(Boolean(report.resume?.trim()))
        setIsCreating(true)
        window.scrollTo({ top: 0, behavior: "smooth" })
    }

    const handleResumeChange = (e) => {
        const file = e.target.files?.[ 0 ]

        if (!file) {
            setResumeFile(null)
            setResumeError("")
            return
        }

        if (file.type !== "application/pdf") {
            setResumeFile(null)
            setResumeError("Please upload a PDF file.")
            e.target.value = ""
            return
        }

        if (file.size > 3 * 1024 * 1024) {
            setResumeFile(null)
            setResumeError("File size must be 3MB or less.")
            e.target.value = ""
            return
        }

        setResumeError("")
        setResumeFile(file)
    }

    if (loading) {
        return (
            <main className='loading-screen'>
                <h1>Loading your interview plan...</h1>
            </main>
        )
    }

    return (
        <div className='home-page'>
            <div className='top-bar'>
                <div className='brand' onClick={() => { closeCreatePlan(); navigate('/dashboard') }}>
                    <span>Prep</span>
                    <span className='brand-highlight'>AI</span>
                </div>
                <div className='top-bar__actions'>
                    {!isCreating && reports.length > 0 ? (
                        <>
                            <button className='button btn-new' onClick={openCreatePlan}>+ New Interview Plan</button>
                            <button className='button btn-resume' onClick={() => navigate('/resume')}>Resume</button>
                            <GlobalThemeToggle className='theme-nav-toggle' />
                            <button className='logout-button' onClick={handleLogoutClick}>Logout</button>
                        </>
                    ) : (
                        <>
                            {reports.length > 0 && <button className='button btn-resume' onClick={closeCreatePlan}>&larr; Back</button>}
                            <GlobalThemeToggle className='theme-nav-toggle' />
                            <button className='logout-button' onClick={handleLogoutClick}>Logout</button>
                        </>
                    )}
                </div>
            </div>

            <div className='section-divider' />

            {!isCreating && reports.length > 0 ? (
                <section className='recent-reports'>
                    <div className='recent-reports__header'>
                        <h2>My Recent Interview Plans</h2>
                        <span className='recent-reports__count'>{reports.length} plans saved</span>
                    </div>
                    <div className='recent-reports__controls'>
                        <div className='search-wrapper'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                            <input type='text' placeholder='Search plans by role or company...' aria-label='Search plans' />
                        </div>
                        <div className='recent-reports__actions'>
                            <button type='button' className='btn-sort active'>Sort: Newest</button>
                            <button type='button' className='btn-sort'>Score: High to Low</button>
                            <button type='button' className='btn-sort'>All Companies</button>
                        </div>
                    </div>
                    <ul className='reports-list'>
                        {reports.map(report => (
                            <li key={report._id} className='report-item'>
                                <div className='report-item__top'>
                                    <span className='report-item__tag'>
                                        <span className='dot'></span> {report.company || 'GENERAL ROLE'}
                                    </span>
                                    <button
                                        type='button'
                                        className='report-item__menu'
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            setOpenMenuReportId((prev) => prev === report._id ? null : report._id)
                                        }}
                                        aria-label='Open report actions'
                                        aria-expanded={openMenuReportId === report._id}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle><circle cx="5" cy="12" r="1"></circle></svg>
                                    </button>
                                    {openMenuReportId === report._id && (
                                        <div className='report-item__menu-dropdown' onClick={(e) => e.stopPropagation()}>
                                            <button type='button' className='report-item__menu-action' onClick={(e) => handleEditReport(e, report._id)}>
                                                Edit
                                            </button>
                                            <button type='button' className='report-item__menu-action report-item__menu-action--danger' onClick={(e) => handleDeleteReport(e, report)}>
                                                Delete
                                            </button>
                                        </div>
                                    )}
                                </div>
                                <h3 className='report-item__title'>{report.title || 'Untitled Position'}</h3>
                                <p className='report-item__meta'>Generated on {new Date(report.createdAt).toLocaleDateString()}</p>
                                <div className='report-badges'>
                                    <span className={"report-badge report-badge--score " + (report.matchScore >= 80 ? 'score--high' : report.matchScore >= 60 ? 'score--mid' : 'score--low')}>
                                        {report.matchScore ? report.matchScore + "% Match" : 'Match Score'}
                                    </span>
                                    <span className='report-badge report-badge--purple'>{report.skillGaps?.length || 0} skill gaps</span>
                                </div>
                                <button
                                    type='button'
                                    className='report-item__cta'
                                    onClick={() => navigate('/interview/' + report._id)}
                                >
                                    View Report &rarr;
                                </button>
                            </li>
                        ))}
                        <li className='report-item report-item--new' onClick={openCreatePlan}>
                            <div className='report-item__new'>
                                <div className='report-item__plus'>+</div>
                                <span>Create New Plan</span>
                            </div>
                        </li>
                    </ul>
                </section>
            ) : (
                <div className='create-plan-view'>
                    <header className='page-header'>
                        <span className='page-header__tag'>{editingReportId ? 'EDIT INTERVIEW PLAN' : 'AI-POWERED INTERVIEW COACH'}</span>
                        <h1>{editingReportId ? 'Update Your ' : 'Create Your Custom '}<span className='highlight'>Interview Plan</span></h1>
                        <p>{editingReportId ? 'Adjust the saved details below and we will refresh this interview plan for the same report.' : 'Let our AI analyze the job requirements and your unique profile to build a winning strategy.'}</p>
                    </header>

                    <div className='interview-cards-container'>
                        <div className='panel panel--left'>
                            <div className='panel__header'>
                                <span className='panel__icon'>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff2d78" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>
                                </span>
                                <h2>Target Job Description</h2>
                                <span className='badge badge--required'>REQUIRED</span>
                            </div>
                            <div className='panel__textarea-wrapper'>
                                <textarea
                                    value={jobDescription}
                                    onChange={(e) => { setJobDescription(e.target.value) }}
                                    className='panel__textarea'
                                    placeholder="Paste the full job description here...&#10;e.g. 'Senior Frontend Engineer at Google requires proficiency in React, TypeScript, and large-scale system design...'"
                                    maxLength={5000}
                                />
                                <div className='panel__textarea-bottom'>
                                    <div className='char-counter'>{jobDescription.length} / 5000 chars</div>
                                </div>
                            </div>
                            <div className='panel__tip'>
                                <span className='panel__tip-icon'>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="#69b82d"><path d="M12 2C8.686 2 6 4.686 6 8c0 2.25 1.258 4.215 3.123 5.289C9.577 13.57 10 14.156 10 14.811V16c0 1.105 1.12 2 2.222 2h-.444c1.103 0 2.222-.895 2.222-2v-1.189c0-.655.423-1.241.877-1.522C16.742 12.215 18 10.25 18 8c0-3.314-2.686-6-6-6z" /></svg>
                                </span>
                                <div>
                                    <strong>Pro Tip</strong>
                                    <p>Include the full JD for best results &mdash; even boilerplate sections help AI match your skills accurately.</p>
                                </div>
                            </div>
                        </div>

                        <div className='panel panel--right'>
                            <div className='panel__header'>
                                <span className='panel__icon' style={{ color: '#ff2d78' }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                                </span>
                                <h2>Your Profile</h2>
                            </div>

                            <div className='upload-section'>
                                <div className='upload-header'>
                                    <label className='section-label'>Upload Resume</label>
                                    <span className='badge badge--best'>BEST RESULTS</span>
                                </div>
                                <label className='dropzone' htmlFor='resume'>
                                    <span className='dropzone__icon'>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ff2d78" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
                                    </span>
                                    <p className='dropzone__title'>Click to upload or drag &amp; drop</p>
                                    <p className='dropzone__subtitle'>PDF (Max 3MB) &mdash; Resume, CV accepted</p>
                                    <input hidden type='file' id='resume' name='resume' accept='.pdf' onChange={handleResumeChange} />
                                </label>
                                <p className='dropzone__meta'>
                                    {resumeFile ? "Selected: " + resumeFile.name : editingHasResume ? "Using your saved resume. Upload a new PDF only if you want to replace it." : ""}
                                </p>
                                {resumeError && <p className='dropzone__error'>{resumeError}</p>}
                            </div>

                            <div className='or-divider'><span>or</span></div>

                            <div className='self-description'>
                                <label className='section-label' htmlFor='selfDescription'>Quick Self-Description</label>
                                <textarea
                                    value={selfDescription}
                                    onChange={(e) => { setSelfDescription(e.target.value) }}
                                    id='selfDescription'
                                    name='selfDescription'
                                    className='panel__textarea panel__textarea--short'
                                    placeholder="Briefly describe your experience, key skills, and years of experience if you don't have a resume handy..."
                                />
                            </div>

                            <div className='info-box'>
                                <span className='info-box__icon'>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#5da9ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>
                                </span>
                                <p>Either a <strong>Resume</strong> or a <strong>Self Description</strong> is required to generate a personalized plan.</p>
                                {formError && <p className='dropzone__error'>{formError}</p>}
                            </div>
                        </div>
                    </div>

                    <div className='interview-action-footer'>
                        <span className='footer-info'>
                            <span className='dot-status' /> AI-Powered Strategy Generation &middot; Approx 30s
                        </span>
                        <button onClick={handleSubmitReport} className='generate-btn'>
                            <span className="btn-star">&#9733;</span> {editingReportId ? 'Save Interview Plan Changes' : 'Generate My Interview Strategy'}
                        </button>
                    </div>
                </div>
            )}

            {deleteConfirmReport && (
                <div
                    className='delete-report-modal'
                    role='presentation'
                    onClick={() => setDeleteConfirmReport(null)}
                >
                    <div
                        className='delete-report-modal__card'
                        role='dialog'
                        aria-modal='true'
                        aria-labelledby='delete-report-title'
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className='delete-report-modal__badge'>Final Check</div>
                        <h3 id='delete-report-title'>Delete this interview plan?</h3>
                        <p>
                            <strong>{deleteConfirmReport.title || 'Untitled Position'}</strong>
                            {" "}will be removed from your dashboard permanently.
                        </p>
                        <div className='delete-report-modal__actions'>
                            <button
                                type='button'
                                className='delete-report-modal__button delete-report-modal__button--ghost'
                                onClick={() => setDeleteConfirmReport(null)}
                            >
                                Keep Plan
                            </button>
                            <button
                                type='button'
                                className='delete-report-modal__button delete-report-modal__button--danger'
                                onClick={handleConfirmDeleteReport}
                            >
                                Delete Plan
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Home
