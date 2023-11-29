import { useState } from "react"
import { Link, useNavigate, useLocation, Navigate } from "react-router-dom"
import { toast } from "react-toastify"
import { getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { setDoc, doc, serverTimestamp } from "firebase/firestore"
import { db } from '../firebase.config'
import { ReactComponent as RightArrowKey } from '../assets/svg/keyboardArrowRightIcon.svg'
import visibilityIcon from '../assets/svg/visibilityIcon.svg'
import GoogleAuth from "../components/GoogleAuth"
import { useAuthStatus } from "../hooks/useAuthStatus"
import Loading from "../components/Loading"

function SignUp() {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  })
  const {name, email, password} = formData
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
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      )
      
      const user = userCredential.user
      
      updateProfile(auth.currentUser, {
        displayName: name
      })

      const formDataCopy = {...formData}
      delete formDataCopy.password
      formDataCopy.timestamp = serverTimestamp()

      await setDoc(doc(db, 'users', user.uid), formDataCopy)

      navigate('/')
    } catch (error) {
      toast.error('Ooops.. Something Went Wrong')
    }
  }

  const matchPath = (route) => {
    if(route === location.pathname) {
        return true
    }
}

  if(loading) {
    return < Loading />
  }

  return loggedIn && matchPath('/sign-up') ? < Navigate to='/profile' /> : (
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

        <input 
        type="text" 
        className="nameInput"
        placeholder="Name" 
        id="name"
        value={name}
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

        <div className="signUpBar">
          <p className="signUpText">Sign-Up</p>
            <button className="signUpButton">
              < RightArrowKey 
              fill="#ffffff" 
              width='34px' 
              height='34px' />
            </button>
        </div>
      </form>
      
        < GoogleAuth />

      <Link to='/sign-in' className="registerLink">
        Sign-In
      </Link>
    </div>
    </>
  )
}

export default SignUp