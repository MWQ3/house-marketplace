import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { 
getDocs, 
query, 
orderBy,
where,
limit,
startAfter,
collection,
} from "firebase/firestore"
import { db } from "../firebase.config"
import { toast } from "react-toastify"
import Loading from "../components/Loading"
import ListingItem from "../components/ListingItem"

function Category() {
    const [listings, setListings] = useState(null)
    const [loading, setLoading] = useState(true)
    const [loadMoreListings, setLoadMoreListings] = useState(null)
    const param = useParams()

    useEffect(() => {
        const fetchListings = async () => {
            try {
                // get a reference
                const listingsRef = collection(db, 'listings')

                // create a collection
                const q = query(
                    listingsRef,
                    where('type', '==', param.categoryName),
                    orderBy('timestamp' ,'desc'),
                    limit(10)
                )

                    // execute query
                const querySnap = await getDocs(q)

                const lastListing = querySnap.docs[querySnap.docs.length - 1]
                
                setLoadMoreListings(lastListing)

                const listings = []
                querySnap.forEach((doc) => {
                    return listings.push({
                        id: doc.id,
                        data: doc.data()
                    })
                })

                setListings(listings)
                setLoading(false)
            } catch (error) {
                console.log(error)
                toast.error('Oops.. Couldn\'t Get the Listings')
            }
        }

        fetchListings()
    }, [param.categoryName])

    const fetchMoreListings = async () => {
        try {
            // get a reference
            const listingsRef = collection(db, 'listings')

            // create a collection
            const q = query(
                listingsRef,
                where('type', '==', param.categoryName),
                orderBy('timestamp' ,'desc'),
                limit(10),
                startAfter(loadMoreListings)
            )

                // execute query
            const querySnap = await getDocs(q)

            const listings = []
            querySnap.forEach((doc) => {
                return listings.push({
                    id: doc.id,
                    data: doc.data()
                })
            })

            setListings((prevState) => [...prevState, ...listings])
            setLoading(false)
        } catch (error) {
            console.log(error)
            toast.error('Oops.. Couldn\'t Load More Listings')
        }
    }

  return (
    <div className="category">
        <header>
            <p className="pageHeader">
                {param.categoryName === 'rent' ?    'Places to Rent' 
                : 'Places to Sell'}
            </p>
        </header>

        {loading ? < Loading /> 
        : listings && listings.length > 0 ? (
        <>
        <main>
            <ul className="categoryListings">
                {listings.map((listing) => {
                    return < ListingItem listing={listing.data} id={listing.id} key={listing.id} />
                })}
            </ul>
        </main>
        <br />
        <br />
        {loadMoreListings && listings.length > 10 && (
            <p 
            className="loadMore"
            onClick={() => fetchMoreListings()}>
                Load More</p>
        )}
        </>


        ) 
        : (
        <p>No listings for {param.categoryName}</p>
        )}
    </div>
  )
}

export default Category