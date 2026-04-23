import { useEffect, useState } from "react"

const STORAGE_KEY = "prepai-theme"

const getInitialTheme = () => {
    const savedTheme = localStorage.getItem(STORAGE_KEY)
    if (savedTheme === "light" || savedTheme === "dark") {
        return savedTheme
    }

    return "dark"
}

const SunIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2" />
        <path d="M12 20v2" />
        <path d="m4.93 4.93 1.41 1.41" />
        <path d="m17.66 17.66 1.41 1.41" />
        <path d="M2 12h2" />
        <path d="M20 12h2" />
        <path d="m6.34 17.66-1.41 1.41" />
        <path d="m19.07 4.93-1.41 1.41" />
    </svg>
)

const MoonIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 3a6 6 0 1 0 9 9A9 9 0 1 1 12 3z" />
    </svg>
)

const GlobalThemeToggle = ({ className = "theme-nav-toggle" }) => {
    const [ theme, setTheme ] = useState(getInitialTheme)

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme)
        localStorage.setItem(STORAGE_KEY, theme)
    }, [ theme ])

    return (
        <button
            type="button"
            className={className}
            onClick={() => setTheme((prev) => (prev === "dark" ? "light" : "dark"))}
            aria-label="Toggle theme"
            title={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
        >
            <span aria-hidden="true">{theme === "dark" ? <SunIcon /> : <MoonIcon />}</span>
        </button>
    )
}

export default GlobalThemeToggle
