import React, { useEffect, useState } from "react"
import { Link } from "react-router"
import heroImage from "../../../assets/hero.png"
import "../../landing/style/landing.scss"
import { useAuth } from "../../auth/hooks/useAuth"
import GlobalThemeToggle from "../../../theme/GlobalThemeToggle.jsx"

const FEATURE_CARDS = [
    {
        eyebrow: "Role Intelligence",
        title: "Match your profile against any job post",
        text: "See where your strengths land, where your gaps are, and what deserves practice before the interview."
    },
    {
        eyebrow: "Focused Practice",
        title: "Get better questions, not bigger question lists",
        text: "PrepAI generates technical, behavioral, and follow-up prompts tailored to your target role and background."
    },
    {
        eyebrow: "Resume Upgrade",
        title: "Turn your experience into ATS-friendly positioning",
        text: "Create a role-aligned resume draft with better framing, stronger bullets, and clearer interview stories."
    }
]

const STEPS = [
    {
        number: "01",
        title: "Drop in the job description",
        text: "Paste the role requirements and add either your resume or a short summary about your experience."
    },
    {
        number: "02",
        title: "Get a personalized interview brief",
        text: "Receive a match score, skill gap analysis, likely questions, and a preparation roadmap built around the role."
    },
    {
        number: "03",
        title: "Practice and refine with confidence",
        text: "Use the roadmap, chat guidance, and resume tools to tighten weak spots before the actual interview."
    }
]

const HERO_POINTS = [
    "Role-specific question generation",
    "Skill-gap driven study roadmap",
    "Resume export tailored to the target role"
]

const HERO_HEADLINE_PREFIX = "Go from job post to"
const HERO_TYPED_PHRASES = [
    "interview-ready answers.",
    "role-specific mock questions.",
    "resume stories that land."
]
const HERO_FALLBACK_HEADLINE = `${HERO_HEADLINE_PREFIX} ${HERO_TYPED_PHRASES[0]}`

const REPORT_MODULES = [
    {
        label: "Match score",
        title: "See where you stand before you start practicing",
        text: "Get a quick signal on how well your background lines up with the role so you know where to focus first."
    },
    {
        label: "Question sets",
        title: "Practice technical and behavioral questions that fit the job",
        text: "Review likely interview questions with intent and model-answer direction instead of random internet lists."
    },
    {
        label: "Preparation plan",
        title: "Turn weak spots into a day-by-day roadmap",
        text: "Use the generated plan to structure your prep across the exact gaps the role is likely to expose."
    },
    {
        label: "Resume tools",
        title: "Refine your resume around the same target role",
        text: "Keep your resume and interview preparation aligned so your story is consistent from application to interview."
    }
]

const USE_CASES = [
    {
        title: "Applying to a new role",
        text: "Quickly break down a fresh job description and understand what matters before you spend hours preparing."
    },
    {
        title: "Switching domains or stacks",
        text: "Figure out which missing skills and stories need extra attention when the role is adjacent to your past work."
    },
    {
        title: "Getting interview-ready fast",
        text: "Use the roadmap and practice flows when you already have an interview date and need focused preparation."
    }
]

const FAQS = [
    {
        question: "Do I need a resume to use PrepAI?",
        answer: "No. You can upload a resume for better results, but you can also add a short self-summary and still generate a useful plan."
    },
    {
        question: "Can I use it for different job roles?",
        answer: "Yes. The flow is built around the job description you provide, so it can adapt to different roles, companies, and seniority levels."
    },
    {
        question: "What happens after the report is generated?",
        answer: "You can review the report, practice interview questions, refine the roadmap, and generate a resume aligned to that same target role."
    }
]

const Landing = () => {
    const { user } = useAuth()
    const primaryLink = user ? "/dashboard" : "/register"
    const primaryLabel = user ? "Open Dashboard" : "Start Free"
    const [ activePhraseIndex, setActivePhraseIndex ] = useState(0)
    const [ typedHeadline, setTypedHeadline ] = useState("")
    const [ isDeleting, setIsDeleting ] = useState(false)
    const activePhrase = HERO_TYPED_PHRASES[activePhraseIndex]

    useEffect(() => {
        if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            setTypedHeadline(HERO_TYPED_PHRASES[0])
            return
        }

        const completedWord = typedHeadline === activePhrase
        const clearedWord = typedHeadline.length === 0
        const nextDelay = completedWord ? 1700 : isDeleting ? 28 : 44

        const timeoutId = window.setTimeout(() => {
            if (!isDeleting) {
                if (completedWord) {
                    setIsDeleting(true)
                    return
                }

                setTypedHeadline(activePhrase.slice(0, typedHeadline.length + 1))
                return
            }

            if (!clearedWord) {
                setTypedHeadline(activePhrase.slice(0, typedHeadline.length - 1))
                return
            }

            setIsDeleting(false)
            setActivePhraseIndex((currentIndex) => (currentIndex + 1) % HERO_TYPED_PHRASES.length)
        }, nextDelay)

        return () => window.clearTimeout(timeoutId)
    }, [ activePhrase, isDeleting, typedHeadline ])

    return (
        <main className="landing-page">
            <div className="landing-backdrop" />
            <div className="landing-grid" />
            <div className="landing-orb landing-orb--left" />
            <div className="landing-orb landing-orb--right" />

            <header className="landing-topbar">
                <Link to="/" className="landing-brand">
                    Prep<span>AI</span>
                </Link>

                <div className="landing-topbar__actions">
                    <Link to={user ? "/dashboard" : "/login"} className="landing-button landing-button--ghost landing-link">
                        {user ? "Dashboard" : "Log in"}
                    </Link>
                    {!user && (
                        <Link to="/register" className="landing-button landing-button--ghost">
                            Create account
                        </Link>
                    )}
                    <GlobalThemeToggle className="theme-nav-toggle landing-theme-toggle" />
                </div>
            </header>

            <section className="landing-hero">
                <div className="landing-copy">
                    <span className="landing-pill">AI interview strategy for real job hunts</span>
                    <h1 className="landing-headline" aria-label={HERO_FALLBACK_HEADLINE}>
                        <span className="landing-headline__static">{HERO_HEADLINE_PREFIX}</span>
                        <span className="landing-typed-heading">
                            <span className="landing-typed-text">{typedHeadline || "\u00A0"}</span>
                            <span className="landing-typed-ghost" aria-hidden="true">
                                {HERO_TYPED_PHRASES.reduce((longestPhrase, phrase) =>
                                    phrase.length > longestPhrase.length ? phrase : longestPhrase, ""
                                )}
                            </span>
                        </span>
                        <span className="landing-typed-cursor" aria-hidden="true" />
                    </h1>
                    <p className="landing-lead">
                        PrepAI turns your job description, resume, and experience into a practical interview plan
                        with targeted questions, skill-gap signals, and a cleaner resume story.
                    </p>

                    <div className="landing-actions">
                        <Link to={primaryLink} className="landing-button landing-button--primary">
                            {primaryLabel}
                        </Link>
                        <Link to={user ? "/interview-practice" : "/login"} className="landing-button landing-button--secondary">
                            Try Interview Practice
                        </Link>
                    </div>

                    <div className="landing-proof">
                        <div className="landing-proof__metric">
                            <strong>One input</strong>
                            <span>job description + profile context</span>
                        </div>
                        <div className="landing-proof__metric">
                            <strong>Three outputs</strong>
                            <span>report, roadmap, resume</span>
                        </div>
                        <div className="landing-proof__metric">
                            <strong>Clear next steps</strong>
                            <span>practice with less noise and more focus</span>
                        </div>
                    </div>
                </div>

                <div className="landing-visual">
                    <div className="landing-visual__glow" />

                    <article className="landing-preview">
                        <div className="landing-preview__top">
                            <span className="landing-preview__eyebrow">Role Match Board</span>
                            <span className="landing-preview__score">84% Match</span>
                        </div>

                        <div className="landing-preview__body">
                            <div className="landing-preview__image-wrap">
                                <img src={heroImage} alt="PrepAI interview planning preview" className="landing-preview__image" />
                            </div>

                            <div className="landing-preview__content">
                                <h2>Frontend Engineer, Product UI</h2>
                                <p>
                                    Strong alignment in React architecture, component systems, and product thinking.
                                    Focus next on testing depth and performance tradeoffs.
                                </p>

                                <div className="landing-preview__meter">
                                    <span />
                                </div>

                                <div className="landing-preview__chips">
                                    {HERO_POINTS.map((point) => (
                                        <span key={point}>{point}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </article>

                </div>
            </section>

            <section className="landing-section">
                <div className="landing-section__intro">
                    <span className="landing-pill landing-pill--muted">What you get</span>
                    <h2>Everything centered around your next interview, not generic prep advice.</h2>
                </div>

                <div className="landing-feature-grid">
                    {FEATURE_CARDS.map((card) => (
                        <article key={card.title} className="landing-feature-card">
                            <span className="landing-feature-card__eyebrow">{card.eyebrow}</span>
                            <h3>{card.title}</h3>
                            <p>{card.text}</p>
                        </article>
                    ))}
                </div>
            </section>

            <section className="landing-section">
                <div className="landing-section__intro">
                    <span className="landing-pill landing-pill--muted">Inside every plan</span>
                    <h2>Your landing point is not just one score. It is a full prep system.</h2>
                </div>

                <div className="landing-module-grid">
                    {REPORT_MODULES.map((module) => (
                        <article key={module.title} className="landing-module-card">
                            <span className="landing-module-card__label">{module.label}</span>
                            <h3>{module.title}</h3>
                            <p>{module.text}</p>
                        </article>
                    ))}
                </div>
            </section>

            <section className="landing-section landing-section--steps">
                <div className="landing-section__intro">
                    <span className="landing-pill landing-pill--muted">How it works</span>
                    <h2>A smoother flow from first application to final practice round.</h2>
                </div>

                <div className="landing-steps">
                    {STEPS.map((step) => (
                        <article key={step.number} className="landing-step">
                            <div className="landing-step__number">{step.number}</div>
                            <div className="landing-step__content">
                                <h3>{step.title}</h3>
                                <p>{step.text}</p>
                            </div>
                        </article>
                    ))}
                </div>
            </section>

            <section className="landing-section">
                <div className="landing-section__intro">
                    <span className="landing-pill landing-pill--muted">Where it helps most</span>
                    <h2>Useful when you need clarity, speed, and a sharper interview story.</h2>
                </div>

                <div className="landing-usecase-grid">
                    {USE_CASES.map((item) => (
                        <article key={item.title} className="landing-usecase-card">
                            <h3>{item.title}</h3>
                            <p>{item.text}</p>
                        </article>
                    ))}
                </div>
            </section>

            <section className="landing-section landing-section--faq">
                <div className="landing-section__intro">
                    <span className="landing-pill landing-pill--muted">Quick answers</span>
                    <h2>Questions people usually have before getting started.</h2>
                </div>

                <div className="landing-faq-list">
                    {FAQS.map((item) => (
                        <article key={item.question} className="landing-faq-card">
                            <h3>{item.question}</h3>
                            <p>{item.answer}</p>
                        </article>
                    ))}
                </div>
            </section>

            <section className="landing-cta">
                <div className="landing-cta__copy">
                    <span className="landing-pill landing-pill--muted">Ready when you are</span>
                    <h2>Walk into the next interview with a plan, not just hope.</h2>
                    <p>Start with one role, one resume, and one focused path forward.</p>
                </div>

                <div className="landing-actions landing-actions--cta">
                    <Link to={primaryLink} className="landing-button landing-button--primary">
                        {primaryLabel}
                    </Link>
                    <Link to="/login" className="landing-button landing-button--secondary">
                        I already have an account
                    </Link>
                </div>
            </section>
        </main>
    )
}

export default Landing
