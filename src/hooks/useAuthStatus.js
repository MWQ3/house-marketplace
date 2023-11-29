import { useState, useEffect, useRef } from "react"
import { getAuth, onAuthStateChanged } from "firebase/auth"

export const useAuthStatus = () => {
    const [loggedIn, setLoggedIn] = useState(false)
    const [loading, setLoading] = useState(true)
    const isMounted = useRef(true)

    useEffect(() => {
            const auth = getAuth()
            // isMount to fix memory leak
            if(isMounted.current) {
                // set a time out on checking the auth status so that the component will render before checking for auth status (if there's a user logged in or not) finishes. not setting a time out will sometimes cause the rendering issues when the user tries to access sing-in page when he's already signed-in & Navigate redirects him to the profile page. it might cause an infinite loop of renders, between the sign-in component & the profile component getting mounted and unmounted simultaneously
                setTimeout(() => {
                    onAuthStateChanged(auth, (user) => {
                        if(user) {
                            setLoggedIn(true)
                            // navigate('/profile')
                        }
                    })

                    setLoading(false)
                }, 850)
            }

        // isMount to fix memory leak
        return () => {
            isMounted.current = false
        }
    }, [isMounted])

  return { loggedIn, loading }
}
