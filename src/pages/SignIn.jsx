import { useState} from "react"
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { ReactComponent as RightArrowKey } from '../assets/svg/keyboardArrowRightIcon.svg'
import { getAuth, signInWithEmailAndPassword } from "firebase/auth"
import visibilityIcon from '../assets/svg/visibilityIcon.svg'
import GoogleAuth from "../components/GoogleAuth"
import { useAuthStatus } from "../hooks/useAuthStatus"
import Loading from "../components/Loading"

function SignIn() {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const {email, password} = formData
  const {loggedIn, loading} = useAuthStatus()

  const navigate = useNavigate()
  const location = useLocation()

  const handleChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const auth = getAuth()
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const user = userCredential.user

      if(user) {
        console.log(user)
        navigate('/')
      }

    } catch (error) {
      toast.error('Wrong Password or Username')
    }
  }

  // console.log(location.pathname)

  const matchPath = (route) => {
    if(route === location.pathname) {
        return true
    }
}

  if(loading) {
    return < Loading />
  }

  return loggedIn && matchPath('/sign-in') ? < Navigate to='/profile' /> : (
    <> 
    <div className="pageContainer">
      <header>
        <p className="pageHeader">Welcome</p>
      </header>

      <form onSubmit={handleSubmit}>
        <input 
        type="email" 
        className="emailInput"
        placeholder="Email" 
        id="email"
        value={email}
        onChange={handleChange} />

        <div className="passwordInputDiv">
          <input 
          type={showPassword ? 'text' : 'password'} 
          className="passwordInput"
          placeholder="Password" 
          id="password" 
          value={password}
          onChange={handleChange} />

          <img 
          src={visibilityIcon} 
          alt="Show Password?"
          className="showPassword"
          onClick={() => setShowPassword((prevState) => !prevState)} />
        </div>

        <Link to='/forgot-password' className="forgotPasswordLink">
          Forgot Password?
        </Link>

        <div className="signInBar">
          <p className="signInText">Sign-In</p>
            <button className="signInButton">
              < RightArrowKey 
              fill="#ffffff" 
              width='34px' 
              height='34px' />
            </button>
        </div>
      </form>

        < GoogleAuth />
      
      <Link to='/sign-up' className="registerLink">
        Sign-Up Instead
      </Link>
    </div>
    </>
  )
}

export default SignIn