import { useState, useEffect } from "react"
import { getDocs, collection, query, orderBy, limit } from "firebase/firestore"
import { db } from "../firebase.config"
import { useNavigate } from "react-router-dom"
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/swiper-bundle.min.css'
import SwiperCore, { Navigation, Pagination, Scrollbar, A11y } from 'swiper'
import Loading from "./Loading"
SwiperCore.use([Navigation, Pagination, Scrollbar, A11y])

function Slider() {
    const [listings, setListings] = useState(null)
    const [loading, setLoading] = useState(true)

    const navigate = useNavigate()

    useEffect(() => {
        const fetchListings = async () => {
            const listingsRef = collection(db, 'listings')
            const q = query(
                listingsRef, 
                orderBy('timestamp', 'desc'),
                limit(5)
                )

            const querySnap = await getDocs(q)

            const listings = []
            querySnap.forEach((doc) => {
                listings.push({
                    data: doc.data(),
                    id: doc.id
                })
            }
        )
            
            setListings(listings)
            setLoading(false)
            // console.log(listings)
        }
        
        
        fetchListings()
    }, [])

    if(loading) {
       return <Loading />
    }

    if(listings.length === 0) {
      return <></>
    }


  return (

    listings && (
    <>
    <p className="exploreHeading">Recommended</p>

    <Swiper 
      slidesPerView={1} 
      pagination={{clickable: true}} 
      className="swiper-container"
      style={{cursor: 'pointer'}}
      >
      {listings.map(({data, id}) => (
        <SwiperSlide 
        key={id}
        onClick={() => navigate(`/category/${data.type}/${id}`)}
        >
          <div 
          style={{
            background: `url(${data.imgUrls[0]}) center no-repeat`,
            backgroundSize: 'cover',
            }} 
            className="swiperSlideDiv">
                <p className="swiperSlideText">{data.name}</p>
                <p className="swiperSlidePrice">
                    ${data.discountedPrice ?? data.regularPrice}
                    {data.type === 'rent' && '/ Month'}
                </p>
            </div>
        </SwiperSlide>
      ))}
      </Swiper>
    </>
  )
    )
}

export default Slider