import React, { useState, useEffect } from 'react'
import '../style/interview.scss'
import { useInterview } from '../hooks/useInterview.js'
import { useNavigate, useParams } from 'react-router'



const NAV_ITEMS = [
    { id: 'technical', label: 'Technical Questions', icon: (<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" /></svg>) },
    { id: 'behavioral', label: 'Behavioral Questions', icon: (<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>) },
    { id: 'roadmap', label: 'Road Map', icon: (<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M7 12h10" /><path d="M10 18h4" /></svg>) },
]

const getQuestionTags = (item) => {
    if (!item?.intention) {
        return []
    }

    return item.intention
        .split(/,|\.|\//)
        .map((part) => part.trim())
        .filter(Boolean)
        .slice(0, 2)
}

// ── Sub-components ────────────────────────────────────────────────────────────
const QuestionCard = ({ item, index }) => {
    const [ open, setOpen ] = useState(false)
    const tags = getQuestionTags(item)

    return (
        <div className='q-card'>
            <div className='q-card__header' onClick={() => setOpen(o => !o)}>
                <span className='q-card__index'>Q{index + 1}</span>
                <div className='q-card__main'>
                    <p className='q-card__question'>{item.question}</p>
                    {tags.length > 0 && (
                        <div className='q-card__chips'>
                            {tags.map((tag) => (
                                <span key={tag} className='q-card__chip'>{tag}</span>
                            ))}
                        </div>
                    )}
                </div>
                <span className={`q-card__chevron ${open ? 'q-card__chevron--open' : ''}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
                </span>
            </div>
            {open && (
                <div className='q-card__body'>
                    <div className='q-card__section'>
                        <span className='q-card__tag q-card__tag--intention'>Intention</span>
                        <p>{item.intention}</p>
                    </div>
                    <div className='q-card__section'>
                        <span className='q-card__tag q-card__tag--answer'>Model Answer</span>
                        <p>{item.answer}</p>
                    </div>
                </div>
            )}
        </div>
    )
}

const RoadMapDay = ({ day }) => (
    <div className='roadmap-day'>
        <div className='roadmap-day__header'>
            <span className='roadmap-day__badge'>Day {day.day}</span>
            <h3 className='roadmap-day__focus'>{day.focus}</h3>
        </div>
        <ul className='roadmap-day__tasks'>
            {day.tasks.map((task, i) => (
                <li key={i}>
                    <span className='roadmap-day__bullet' />
                    {task}
                </li>
            ))}
        </ul>
    </div>
)

// ── Main Component ────────────────────────────────────────────────────────────
const Interview = () => {
    const [ activeNav, setActiveNav ] = useState('technical')
    const [ roadmapDays, setRoadmapDays ] = useState("")
    const [ roadmapError, setRoadmapError ] = useState("")
    const { report, getReportById, loading, getResumePdf, updateRoadmap } = useInterview()
    const { interviewId } = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        if (interviewId) {
            getReportById(interviewId)
        }
    }, [ interviewId, getReportById ])

    const handleRegenerateRoadmap = async () => {
        const normalized = Number(roadmapDays)
        if (!Number.isFinite(normalized) || normalized <= 0) {
            setRoadmapError("Enter a valid number of days.")
            return
        }

        setRoadmapError("")
        await updateRoadmap({ interviewId, roadmapDays: normalized })
    }




    if (loading || !report) {
        return (
            <main className='loading-screen'>
                <h1>Loading your interview plan...</h1>
            </main>
        )
    }

    const scoreColor =
        report.matchScore >= 80 ? 'score--high' :
            report.matchScore >= 60 ? 'score--mid' : 'score--low'

    const reportTitle = report?.title || 'SDE-1 Role'
    const formattedDate = report?.createdAt ? new Date(report.createdAt).toLocaleDateString() : new Date().toLocaleDateString()


    return (
        <div className='interview-page'>
            <div className='interview-layout'>
                <header className='interview-topbar'>
                    <div className='interview-topbar__brand' onClick={() => navigate('/')}>Prep<span>AI</span></div>
                    <h1 className='interview-topbar__title'>Interview Report for {reportTitle}</h1>
                    <p className='interview-topbar__date'>{formattedDate}</p>
                </header>

                <div className='interview-body'>
                    {/* ── Left Nav ── */}
                    <nav className='interview-nav'>
                        <div className="nav-content">
                            <p className='interview-nav__label'>Sections</p>
                            {NAV_ITEMS.map(item => (
                                <button
                                    key={item.id}
                                    className={`interview-nav__item ${activeNav === item.id ? 'interview-nav__item--active' : ''}`}
                                    onClick={() => setActiveNav(item.id)}
                                >
                                    <span className='interview-nav__icon'>{item.icon}</span>
                                    {item.label}
                                </button>
                            ))}
                        </div>
                        <div className='nav-actions'>
                            <button className='nav-action-button' onClick={() => navigate(-1)}>&larr; Back</button>
                            <button className='nav-action-button' onClick={() => navigate('/')}>Home</button>
                            <button className='nav-action-button' onClick={() => navigate(`/interview-practice/${interviewId}`)}>Interview Practice</button>
                            <button className='nav-action-button' onClick={() => navigate(`/resume-template/${interviewId}`)}>Resume Templates</button>
                            <button onClick={() => { getResumePdf(interviewId) }} className='nav-action-button nav-action-button--download'>Download Resume</button>
                        </div>
                    </nav>

                    <div className='interview-divider' />

                    {/* ── Center Content ── */}
                    <main className='interview-content'>
                    {activeNav === 'technical' && (
                        <section>
                            <div className='content-header'>
                                <h2>Technical Questions</h2>
                                <span className='content-header__count'>{report.technicalQuestions.length} questions</span>
                            </div>
                            <div className='q-list'>
                                {report.technicalQuestions.map((q, i) => (
                                    <QuestionCard key={i} item={q} index={i} />
                                ))}
                            </div>
                        </section>
                    )}

                    {activeNav === 'behavioral' && (
                        <section>
                            <div className='content-header'>
                                <h2>Behavioral Questions</h2>
                                <span className='content-header__count'>{report.behavioralQuestions.length} questions</span>
                            </div>
                            <div className='q-list'>
                                {report.behavioralQuestions.map((q, i) => (
                                    <QuestionCard key={i} item={q} index={i} />
                                ))}
                            </div>
                        </section>
                    )}

                    {activeNav === 'roadmap' && (
                        <section>
                            <div className='content-header'>
                                <h2>Preparation Road Map</h2>
                                <span className='content-header__count'>{report.preparationPlan.length}-day plan</span>
                            </div>
                            <div className='roadmap-controls'>
                                <div className='roadmap-controls__field'>
                                    <label htmlFor='roadmapDays'>Roadmap Days</label>
                                    <input
                                        id='roadmapDays'
                                        type='number'
                                        min='1'
                                        max='60'
                                        inputMode='numeric'
                                        value={roadmapDays}
                                        onChange={(e) => setRoadmapDays(e.target.value)}
                                    />
                                </div>
                                <button className='roadmap-controls__button' onClick={handleRegenerateRoadmap}>
                                    Generate Roadmap
                                </button>
                                {roadmapError && <p className='roadmap-controls__error'>{roadmapError}</p>}
                            </div>
                            {report.preparationPlan.length === 0 && (
                                <p className='roadmap-empty'>Enter days and generate your roadmap.</p>
                            )}
                            <div className='roadmap-list'>
                                {report.preparationPlan.map((day) => (
                                    <RoadMapDay key={day.day} day={day} />
                                ))}
                            </div>
                        </section>
                    )}
                    </main>

                    <div className='interview-divider' />

                    {/* ── Right Sidebar ── */}
                    <aside className='interview-sidebar'>

                    {/* Match Score */}
                    <div className='match-score'>
                        <p className='match-score__label'>Match Score</p>
                        <div className={`match-score__ring ${scoreColor}`}>
                            <span className='match-score__value'>{report.matchScore}</span>
                            <span className='match-score__pct'>%</span>
                        </div>
                        <p className='match-score__sub'>Strong match for this role</p>
                    </div>

                    <div className='sidebar-divider' />

                    {/* Skill Gaps */}
                    <div className='skill-gaps'>
                        <p className='skill-gaps__label'>Skill Gaps</p>
                        <div className='skill-gaps__list'>
                            {report.skillGaps.map((gap, i) => (
                                <span key={i} className={`skill-tag skill-tag--${gap.severity}`}>
                                    {gap.skill}
                                </span>
                            ))}
                        </div>
                    </div>

                    </aside>
                    <button
                        type='button'
                        className='floating-chat'
                        onClick={() => navigate(`/chat/${interviewId}`)}
                        aria-label='Open chat'
                    >
                        <svg viewBox='0 0 24 24' aria-hidden='true'>
                            <path d='M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
                        </svg>
                        Chatbot
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Interview