import React,{useState} from 'react'
import { useNavigate, Link } from 'react-router'
import "../auth.form.scss"
import { useAuth } from '../hooks/useAuth'

const Login = () => {

    const { loading, handleLogin } = useAuth()
    const navigate = useNavigate()

    const [ identifier, setIdentifier ] = useState("")
    const [ password, setPassword ] = useState("")
    const [errorMessage, setErrorMessage] = useState("")

    const handleSubmit = async (e) => {
        e.preventDefault()
        setErrorMessage("")
        const result = await handleLogin({ email: identifier, password, identifier })
        if (!result?.ok) {
            setErrorMessage(result?.message || "Login failed")
            return
        }
        navigate('/')
    }

    if(loading){
        return (<main className='auth-login-page'><h1>Loading.......</h1></main>)
    }


    return (
        <main className='auth-login-page'>
            <section className='auth-login-split'>
                <aside className='auth-login-hero'>
                    <div className='auth-login-hero__content'>
                        <h1 className='auth-login-hero__brand'>Prep<span>AI</span></h1>
                        <span className='auth-login-hero__badge'>AI-Powered Interview Coaching</span>
                        <h2>Land Your Dream Job with <span>Smart Prep</span></h2>
                        <p>
                            Get personalized interview questions, skill gap analysis, and a custom 7-day study roadmap.
                        </p>

                        <ul className='auth-login-hero__highlights'>
                            <li>
                                <strong>AI-Generated Interview Questions</strong>
                                <span>Tailored to your resume and job description.</span>
                            </li>
                            <li>
                                <strong>Skill Gap Analysis</strong>
                                <span>Know exactly what to improve before the interview.</span>
                            </li>
                            <li>
                                <strong>Preparation Roadmap</strong>
                                <span>Day-by-day action plan to ace your interview.</span>
                            </li>
                        </ul>
                    </div>
                </aside>

                <section className='auth-login-panel'>
                    <div className='auth-login-card'>
                        <h3>Welcome back</h3>
                        <p className='auth-login-card__sub'>Sign in to continue your interview preparation</p>

                        <form onSubmit={handleSubmit}>
                            <div className="input-group">
                                <label htmlFor="email">Email or Username</label>
                                <input
                                    value={identifier}
                                    onChange={(e) => { setIdentifier(e.target.value) }}
                                    type="text" id="email" name='email' placeholder='you@example.com or your username' />
                            </div>
                            <div className="input-group">
                                <label htmlFor="password">Password</label>
                                <input
                                    value={password}
                                    onChange={(e) => { setPassword(e.target.value) }}
                                    type="password" id="password" name='password' placeholder='••••••••' />
                            </div>
                            <p className='auth-login-forgot'>Forgot password?</p>
                            <button className='button primary-button auth-login-submit'>Sign In</button>
                        </form>

                        {errorMessage && <p className='form-error'>{errorMessage}</p>}

                        <p className='auth-login-register'>
                            Don't have an account? <Link to={"/register"}>Create one free</Link>
                        </p>

                        <p className='auth-login-terms'>
                            By signing in, you agree to our <span>Terms of Service</span> and <span>Privacy Policy</span>.
                        </p>
                    </div>
                </section>
            </section>
        </main>
    )
}

export default Login