import { useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import { getAuth, updateProfile } from "firebase/auth"
import { 
  updateDoc, 
  doc, 
  getDocs,
  query,
  where,
  collection,
  deleteDoc,
  orderBy
  } from "firebase/firestore"
import { db } from "../firebase.config"
import { toast } from "react-toastify"
import homeIcon from '../assets/svg/homeIcon.svg'
import rightArrow from '../assets/svg/keyboardArrowRightIcon.svg'
import Loading from "../components/Loading"
import ListingItem from '../components/ListingItem'

function Profile() {
  const auth = getAuth()
  const [changeDetails, setChangeDetails] = useState(false)
  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email,
  })
  const [listings, setListings] = useState(null)
  const [loading, setLoading] = useState(true)

  const {name, email} = formData

  const navigate = useNavigate()

  const handleLogOut = () => {
    auth.signOut()
    navigate('/')
  }

  useEffect(() => {
    const fetchListings = async () => {
      const listingsRef = collection(db, 'listings')
      const q = query(
        listingsRef, 
        where('userRef', '==', auth.currentUser.uid),
        orderBy('timestamp', 'desc'))
        const querySnap = await getDocs(q)

        const listings = []

        querySnap.forEach((doc) => {
          listings.push({
            data: doc.data(),
            id: doc.id
          })
        })

        setListings(listings)
        setLoading(false)
    }

    fetchListings()
  }, [auth.currentUser.uid])

  const onSubmit = async () => {
    try {
      if(auth.currentUser.displayName !== name) {
        // update display name in firebase
        await updateProfile(auth.currentUser, {
          displayName: name
        })

        // update in firestore
      const userRef = doc(db, 'users', auth.currentUser.uid)
      await updateDoc(userRef, {
        name,
      })
      }
    } catch (error) {
      console.log(error)
      toast.error('Ops, Something Went Wrong')
    }
    
    
  }

  const handleChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value
    }))
  }

  const deleteListing = async (listingId) => {
    if(window.confirm('Are you sure about that? \'in jhon cena\'s voice\'')) {
      await deleteDoc(doc(db, 'listings', listingId))
      
      const updatedListing = listings.filter((listing) => listing.id !== listingId)
      setListings((prevState) => ([...prevState, updatedListing]))
      toast.success('Deleted, SUCCESSFULLY')
      navigate('/')
    }
  }

  const editListing = (listingId) => {
    navigate(`/edit-listing/${listingId}`)
  }
  
  return (
    
    <div className="profile">
      <header className="profileHeader">
        <p className="pageHeader">My Profile</p>
        <button 
        type="button" 
        className="logOut" 
        onClick={handleLogOut}>
          Log-out
          </button>
      </header>

      <main>
        <div className="profileDetailsHeader">
        <p className="profileDetailsText">Profile Info</p>
        <p 
        className="changePersonalDetails"
        onClick={() => {changeDetails && 
          onSubmit() 
          setChangeDetails((prevState) => !prevState)}}>
          {changeDetails ? 'Done' : 'Change Details'}          
        </p>
        </div>
        
        <div className="profileCard">
          <form>
            <input 
            type="text" 
            id="name"
            className={!changeDetails ? 'profileName' : 'profileNameActive'}
            value={name}
            onChange={handleChange}
            disabled={!changeDetails} />

            <input 
            type="email" 
            id="email"
            className={!changeDetails ? 'profileEmail' : 'profileEmailActive'}
            value={email}
            onChange={handleChange}
            disabled />
          </form>
        </div>

        <Link to='/create-listing' className="createListing">
          <img src={homeIcon} alt="^" />
          <p>Create New Listing</p>
          <img src={rightArrow} alt=">" />
        </Link>

          {loading && (
            <Loading />
          )}

        {!loading && listings?.length > 0 && (
          <>
            <p className="listingText">My Listings</p>
            <ul className="listingsList">
              {listings.map(({data, id}) => (
                < ListingItem 
                key={id} 
                listing={data} 
                id={id}
                handleDelete={() => deleteListing(id)}
                handleEdit={() => editListing(id)} />
              ))}
            </ul>
          </>
        )}
      </main>
    </div>
    
  )
}

export default Profile