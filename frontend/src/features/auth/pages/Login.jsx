import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router'
import "../auth.form.scss"
import { useAuth } from '../hooks/useAuth'
import GlobalThemeToggle from '../../../theme/GlobalThemeToggle.jsx'

const Login = () => {

    const { loading, handleLogin } = useAuth()
    const navigate = useNavigate()

    const [ identifier, setIdentifier ] = useState("")
    const [ password, setPassword ] = useState("")
    const [ errorMessage, setErrorMessage ] = useState("")

    const handleSubmit = async (e) => {
        e.preventDefault()
        setErrorMessage("")
        const result = await handleLogin({ email: identifier, password, identifier })
        if (!result?.ok) {
            setErrorMessage(result?.message || "Login failed")
            return
        }
        navigate('/dashboard')
    }

    if (loading) {
        return (<main className='auth-login-page'><h1>Loading.......</h1></main>)
    }


    return (
        <main className='auth-login-page'>
            <div className='auth-login-topbar'>
                <Link to="/" className='auth-back-link'>Back to home</Link>
                <GlobalThemeToggle className='theme-nav-toggle' />
            </div>
            <section className='auth-login-split'>
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
                                    type="password" id="password" name='password' placeholder='Enter your password' />
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
