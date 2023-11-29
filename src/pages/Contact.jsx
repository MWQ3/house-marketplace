import { useState, useEffect } from "react"
import { doc, getDoc } from "firebase/firestore"
import { useParams, useSearchParams } from "react-router-dom"
import { db } from "../firebase.config"
import { toast } from "react-toastify"

function Contact() {
    const [listingOwner, setListingOwner] = useState(null)
    const [msg, setMsg] = useState('')
    // eslint-disable-next-line
    const [searchParams, setSearchParams] = useSearchParams()

    const param = useParams()

    useEffect(() => {
        const fetchListingOwner = async () => {
            const docRef = doc(db, 'users', param.listingOwnerId)
            const docSnap = await getDoc(docRef)

            if(docSnap.exists()) {
                setListingOwner(docSnap.data())
            } else {
                // you will see this msg if you're a listing that belongs to a deleted user/listing owner. make sure all listings are connected to an actual user that exists
                toast.error('Couldn\'t Fetch Listing Owner Data')
            }
        }

        fetchListingOwner()
    }, [param.listingOwnerId])
  return (
    <div className="pageContainer">
        <header>
            <p className="pageHeader">Contact Listing Owner</p>
        </header>

        {listingOwner !== null && (
            <main>
                <div className="contactLandlord">
                    <p className="landlordName">Contact {listingOwner?.name}
                    </p>
                </div>

                <form className="messageForm">
                    <div className="messageDiv">
                        <label className="messageLabel" htmlFor="message">Message</label>
                        <textarea
                        name="message" 
                        id="message"
                        className="textarea"
                        value={msg}
                        onChange={e => setMsg(e.target.value)}></textarea>
                    </div>
                    
                    <a href={`mailto:${listingOwner.email}?Subject=${searchParams.get('listingName')}&body=${msg}`}>
                        <button 
                        className="primaryButton"
                        type="button">Send Email</button>
                    </a>
                </form>
            </main>
        )}
    </div>
  )
}

export default Contact