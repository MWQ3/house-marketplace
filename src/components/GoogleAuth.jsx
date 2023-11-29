import { useNavigate, useLocation } from "react-router-dom"
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth"
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore"
import { db } from "../firebase.config"
import { toast } from "react-toastify"
import GoogleIcon from '../assets/svg/googleIcon.svg'

function GoogleAuth() {
    const navigate = useNavigate()
    const location = useLocation()

    const handleClick = async () => {
        try {
            const auth = getAuth()
            const provider = new GoogleAuthProvider()
            const result = await signInWithPopup(auth, provider)
            const user = result.user

            const docRef = doc(db, 'users', user.uid)
            const docSnap = await getDoc(docRef)

            if(!docSnap.exists()) {
                await setDoc(docRef, {
                    name: user.displayName,
                    email: user.email,
                    timestamp: serverTimestamp()
                })
            }
            navigate('/')
            toast.success('Signed-in')
        } catch (error) {
            console.log(error)
            toast.error('Ooops. Couldn\'t Sing-in with Google')
        }
    }

  return (
    <div className="socialLogin">
        <p>Sign-{location.pathname === '/sign-in' ? 'In' : 'Up'} With</p>
        <button 
        className="socialIconDiv"
        onClick={handleClick}>
            <img className="socialIconImg" src={GoogleIcon} alt="Google" />
        </button>
    </div>
  )
}

export default GoogleAuth