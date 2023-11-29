import { useState, useEffect } from "react"
import { Link, useParams } from "react-router-dom"
import { db } from "../firebase.config"
import { getAuth } from "firebase/auth"
import { getDoc, doc } from "firebase/firestore"
import Loading from "../components/Loading"
import shareIcon from "../assets/svg/shareIcon.svg"
import { MapContainer, Popup, TileLayer, Marker } from "react-leaflet"
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/swiper-bundle.min.css'
import SwiperCore, { Navigation, Pagination, Scrollbar, A11y } from 'swiper'
SwiperCore.use([Navigation, Pagination, Scrollbar, A11y])

function Listing() {
    const [listing, setListing] = useState(null)
    const [loading, setLoading] = useState(true)
    const [shareLink, setShareLink] = useState(null)

    const param = useParams()
    const auth = getAuth()

    useEffect(() => {
        const fetchListing = async () => {
            const docRef = doc(db, 'listings', param.listingId)
            const docSnap = await getDoc(docRef)
            // console.log(param.listingId)

            if(docSnap.exists()) {
                // console.log(docSnap.data())
                setListing(docSnap.data())
                setLoading(false)
            }

            setLoading(false)
        }
        fetchListing()
    }, [param.listingId])

    if(loading) {
      return < Loading />
    }

  return (
    <main>
      <Swiper 
      slidesPerView={1} 
      pagination={{clickable: true}} 
      className="swiper-container"
      >
      {listing.imgUrls.map((url, index) => (
        <SwiperSlide 
        key={index}
        >
          <div 
          style={{
            background: `url(${listing.imgUrls[index]}) center no-repeat`,
            backgroundSize: 'cover',
            }} 
            className="swiperSlideDiv"></div>
        </SwiperSlide>
      ))}
      </Swiper>

      <div className="shareIconDiv"
      onClick={() => {
        navigator.clipboard.writeText(window.location.href)
        setShareLink(true)
        setTimeout(() => {
          setShareLink(false)
        }, 2000)
      }}>
        <img src={shareIcon} alt="Share" />
      </div>
        {shareLink && <p className="linkCopied">Copied</p>}

        <div className="listingDetails">
          <p 
          className="listingName"
          >{listing.name}- ${listing.offer ? 
          listing.discountedPrice
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, ',') : 
          listing.regularPrice
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          </p>
          
          <p className="listingLocation">{listing.Location}</p>
          <p className="listingType">
            For {listing.type === 'rent' ? 'Rent' : 'Sale'}
          </p>

          {listing.offer && (
            <p className="discountPrice">
              {listing.regularPrice - listing.discountedPrice} Discounted!
            </p>  
          )}

          <ul className="listingDetailsList">
            <li>
              {listing.bedrooms > 1 ? `${listing.bedrooms} Beds` : `${listing.bedrooms} Bed`}
            </li>
            <li>
              {listing.bathrooms > 1 ? `${listing.bathrooms} Bathrooms` : `${listing.bathrooms} Bathroom`}
            </li>
            <li>
              {listing.parking && 'Parking-spot'}
            </li>
            <li>
              {listing.furnished && 'Furnished'}
            </li>
          </ul>
            
            <p className="listingLocationTitle">Location</p>

            <div className="leafletContainer">
              <MapContainer 
              style={{width: '100%', height: '100%'}}
              center={[listing.geolocation.lat, listing.geolocation.lng]}
              zoom={13}
              scrollWheelZoom={false}
              >

                <TileLayer
                 attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                 url='https://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png'
                  />

                <Marker 
                position={[listing.geolocation.lat, listing.geolocation.lng]}
                >
                  <Popup>{listing.location}</Popup>
                </Marker>

              </MapContainer>
            </div>
            {/* add ? to avoid getting any errors if the currentUser is null. if so, we'll get this Output: undefined instead of an error that might break the page or/& the flow of other codes */}
            {auth.currentUser?.uid !== listing.userRef && ( <Link 
            className="primaryButton"
            to={`/contact/${listing.userRef}?listingName=${listing.name}`}>
              Contact Listing Owner
              </Link>
              )}
        </div>
    </main>
  )
}

export default Listing