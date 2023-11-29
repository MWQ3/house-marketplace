import { useState } from "react"
import { getAuth, sendPasswordResetEmail } from "firebase/auth"
import { ReactComponent as RightArrowKey } from '../assets/svg/keyboardArrowRightIcon.svg'
import { toast } from "react-toastify"
import { Link, useNavigate } from "react-router-dom"

function ForgotPWrd() {
  const [email, setEmail] = useState('')
  const navigate = useNavigate()

  const handleChange = (e) => setEmail(e.target.value)

  const handleSubmit = async(e) => {
    e.preventDefault()
    try {
      if(email) {
        const auth = getAuth()
        await sendPasswordResetEmail(auth, email)
        toast.success('Yay, You Successfully Changed it!')
        navigate('/sign-in')
      } else {
        toast.error('Type your email first')
      }
    } catch (error) {
      console.log(error)
      toast.error('Oops. Couldn\'t Reset Password')
    }
  }

  return (
    <div className="pageContainer">
      <header>
        <p className="pageHeader">Reset Password</p>
      </header>

      <main>
        <form onSubmit={handleSubmit}>
          <input 
          type="email" 
          className="emailInput"
          value={email}
          onChange={handleChange} />

          <Link 
          to='/sign-in' 
          className='forgotPasswordLink'>
            Sign-in
            </Link>

            <div className="signInBar">
              <div className="signInText">Reset Password</div>
              <button className="signInButton">
                < RightArrowKey 
                fill='#fff' 
                width='34px' 
                height='34px' />
              </button>
            </div>
        </form>
      </main>
    </div>
  )
}

export default ForgotPWrd