import React,{useState} from 'react'
import { useNavigate, Link } from 'react-router'
import "../auth.form.scss"
import { useAuth } from '../hooks/useAuth'
import GlobalThemeToggle from '../../../theme/GlobalThemeToggle.jsx'

const Register = () => {

    const navigate = useNavigate()
    const [ username, setUsername ] = useState("")
    const [ email, setEmail ] = useState("")
    const [ password, setPassword ] = useState("")
    const [errorMessage, setErrorMessage] = useState("")

    const {loading,handleRegister} = useAuth()
    
    const handleSubmit = async (e) => {
        e.preventDefault()
        setErrorMessage("")
        const result = await handleRegister({username,email,password})
        if (!result?.ok) {
            setErrorMessage(result?.message || "Registration failed")
            return
        }
        navigate("/dashboard")
    }

    if(loading){
        return (<main className='auth-form-page'><h1>Loading.......</h1></main>)
    }

    return (
        <main className='auth-form-page'>
            <div className='auth-form-topbar'>
                <Link to="/" className='auth-back-link'>Back to home</Link>
                <GlobalThemeToggle className='theme-nav-toggle' />
            </div>
            <div className="form-container">
                <h1>Register</h1>

                <form onSubmit={handleSubmit}>

                    <div className="input-group">
                        <label htmlFor="username">Username</label>
                        <input
                            onChange={(e) => { setUsername(e.target.value) }}
                            type="text" id="username" name='username' placeholder='Enter username' />
                    </div>
                    <div className="input-group">
                        <label htmlFor="email">Email</label>
                        <input
                            onChange={(e) => { setEmail(e.target.value) }}
                            type="email" id="email" name='email' placeholder='Enter email address' />
                    </div>
                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <input
                            onChange={(e) => { setPassword(e.target.value) }}
                            type="password" id="password" name='password' placeholder='Enter password' />
                    </div>

                    <button className='button primary-button' >Register</button>

                </form>
                {errorMessage && <p className='form-error'>{errorMessage}</p>}

                <p>Already have an account? <Link to={"/login"} >Login</Link> </p>
            </div>
        </main>
    )
}

export default Register
