import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage"
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase.config' 
import { toast } from 'react-toastify'
import { v4 as uuidv4 } from 'uuid'
import Loading from '../components/Loading'

function CreateListing() {
    // eslint-disable-next-line
    const [geoLocationOn, setGeoLocationOn] = useState(false)
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        type: 'rent',
        name: '',
        bathrooms: 1,
        bedrooms: 1,
        furnished: false,
        parking: false,
        offer: false,
        imgs: {},
        address: '',
        regularPrice: 0,
        discountedPrice: 0,
        lat: 0,
        lng: 0
    })

    const {
        type, name, bathrooms, bedrooms, furnished, parking, offer, imgs, address, regularPrice,discountedPrice, lat, lng
    } = formData

    const auth = getAuth()
    const navigate = useNavigate()
    const isMounted = useRef(true)
    useEffect(() => {
        if(isMounted) {
            onAuthStateChanged(auth, (user) => {
                if(user) {
                    setFormData({...formData, userRef: user.uid})
                    // setFormData((prevState) => ({...prevState, userRef: user.uid}))
                } else {
                    navigate('/sign-in')
                }
            })
        }


        return () => {
            isMounted.current = false
        }
        // eslint-disable-next-line
    }, [isMounted])


    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        if(offer && (Number(discountedPrice) >= Number(regularPrice))) {
            toast.error('Discounted Price cannot be Higher or Equal to the Regular Price')
            setLoading(false)
            // console.log(offer)
            // console.log(discountedPrice)
            // console.log(regularPrice)
            return
        }

        // if((regularPrice.toString().length > 1 && regularPrice.toString()[0] === '0') || (offer && discountedPrice.toString().length > 1 && discountedPrice.toString()[0] === '0')) {
        //     toast.error('Cannot start regular price &/or discounted price with 0 ')
        //     setLoading(false)
        //     return
        // }

        if (regularPrice.toString()[0] === '0' || (offer && discountedPrice.toString()[0] === '0')) {
            toast.error('Cannot start regular price and/or discounted price with 0');
            setLoading(false);
            return;
          }
          

        if(imgs.length > 6) {
            toast.error('6 Images Max')
            setLoading(false)
            return
        }

        // note: removed location
        const geolocation = {}

        if(!geoLocationOn) {
            geolocation.lat = lat
            geolocation.lng = lng
        }


        // store imgs in firebase
        const storeImgs = async (image) => {
            return new Promise((resolve, reject) => {
                const storage = getStorage()
                const fileName = `${auth.currentUser.uid}-${image.name}-${uuidv4()}`
                const storageRef = ref(storage, 'images/' + fileName)
    
                const uploadTask = uploadBytesResumable(storageRef, image)
    
                
                uploadTask.on('state_changed', 
                (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                console.log('Upload is ' + progress + '% done')
                switch (snapshot.state) {
                    case 'paused':
                    console.log('Upload is paused');
                    break
                    case 'running':
                    console.log('Upload is running');
                    break
                    default:
                        break
                }
                }, 
                (error) => {
                    reject(error)
                }, 
                () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    resolve(downloadURL)
                })
                }
                )
            })
        }

        const imgUrls = await Promise.all(
                [...imgs].map((img) => storeImgs(img))
                ).catch(() => {
                    setLoading(false)
                    toast.error('Couldn\'t Upload Images')
                    return
                })       
        
        // console.log(imgUrls)

        const formDataCopy = {
            ...formData,
            geolocation,
            imgUrls,
            timestamp: serverTimestamp()
        }

        formDataCopy.location = address
        delete formDataCopy.imgs
        delete formDataCopy.address
        !formDataCopy.offer && delete formDataCopy.discountedPrice

        const docRef = await addDoc(collection(db, 'listings'), formDataCopy)
        

        setLoading(false)
        toast.success('listing created')
        navigate(`/category/${formDataCopy.type}/${docRef.id}`)
    }

    const handleMutate = (e) => {
        let boolean = null

        if(e.target.value === 'true') {
            boolean = true
        }
        if(e.target.value === 'false') {
            boolean = false
        }

        // handle files
        if(e.target.files) {
            setFormData((prevState) => ({
                ...prevState,
                imgs: e.target.files,
            }))
        }

        // handle boolean & values
        if(!e.target.files) {
            setFormData((prevState) => ({
                ...prevState,
                [e.target.id]: boolean ?? e.target.value
            }))
        }
    }

    if(loading) {
        return < Loading />
    }

  return (
    <div className='profile'>
        <header>
            <p className="pageHeader">Create a Listing</p>
        </header>

        <main>
            <form onSubmit={handleSubmit}>
                <label className='formLabel'>Sell / Rent</label>
                <div className="formButtons">
                    <button
                    className={type === 'sale' ? 'formButtonActive' : 'formButton'}
                    type='button'
                    id='type'
                    value='sale'
                    onClick={handleMutate}>
                        Sell
                    </button>

                    <button
                    className={type === 'rent' ? 'formButtonActive' : 'formButton'}
                    type='button'
                    id='type'
                    value='rent'
                    onClick={handleMutate}>
                        Rent
                    </button>
                </div>
                <label className="formLabel">Name</label>
                <input 
                className='formInputName'
                type='text'
                id='name'
                value={name}
                onChange={handleMutate}
                maxLength='32'
                minLength='6' 
                required />
            

            <div className="formRooms flex">
                <div>
                    <label className="formLabel">Bedrooms</label>
                    <input
                    className='formInputSmall' 
                    type="number" 
                    id="bedrooms"
                    value={bedrooms}
                    onChange={handleMutate}
                    min='1'
                    max='50'
                    required />
                </div>

                <div>
                    <label className="formLabel">Bathrooms</label>
                    <input
                    className='formInputSmall' 
                    type="number" 
                    id="bathrooms"
                    value={bathrooms}
                    onChange={handleMutate}
                    min='1'
                    max='50'
                    required />
                </div>
            </div>
            <label className="formLabel">Parking Spot</label>
            <div className="formButtons">
                <button 
                className={parking ? 'formButtonActive' : 'formButton'}
                type='button'
                id='parking'
                value={true}
                onClick={handleMutate}>
                    Yes
                </button>
                <button 
                className={!parking && parking !== null ? 'formButtonActive' : 'formButton'}
                type='button'
                id='parking'
                value={false}
                onClick={handleMutate}>
                    No
                </button>
            </div>

            <label className="formLabel">Furnished</label>
            <div className="formButtons">
                <button 
                className={furnished ? 'formButtonActive' : 'formButton'}
                type='button'
                id='furnished'
                value={true}
                onClick={handleMutate}>
                    Yes
                </button>
                <button 
                className={!furnished && furnished !== null ? 'formButtonActive' : 'formButton'}
                type='button'
                id='furnished'
                value={false}
                onClick={handleMutate}>
                    No
                </button>
            </div>

            <label className="formLabel">Address</label>
            <textarea 
            className='formInputAddress'
            type='text'
            id='address'
            value={address}
            onChange={handleMutate}
            required />

            {!geoLocationOn && (
                <div className="formLatLng flex">
                <div>
                    <label className="formLabel">Latitude</label>
                    <input
                    className='formInputSmall'
                    type='number'
                    id='lat'
                    value={lat}
                    onChange={handleMutate}
                    required />
                    </div>

                    <div>
                    <label className="formLabel">Longitude</label>
                    <input
                    className='formInputSmall'
                    type='number'
                    id='lng'
                    value={lng}
                    onChange={handleMutate}
                    required />
                </div>
                </div>
            )}

            <label className="formLabel">Offer</label>
            <div className="formButtons">
                <button 
                className={offer ? 'formButtonActive' : 'formButton'}
                type='button'
                id='offer'
                value={true}
                onClick={handleMutate}>
                    Yes
                </button>
                <button 
                className={!offer && offer !== null ? 'formButtonActive' : 'formButton'}
                type='button'
                id='offer'
                value={false}
                onClick={handleMutate}>
                    No
                </button>
            </div>

            <label className="formLabel">Regular Price</label>
                <div className='formPriceDiv'> 
                <input
                className='formInputSmall' 
                type="number" 
                id="regularPrice"
                value={regularPrice}
                onChange={handleMutate}
                min='50'
                max='7500000000'
                required />
                {type === 'rent' && (
                <p className='formPriceText'>$ /Month</p>
                )}
                </div>

            {offer && (
                <>
                <label className="formLabel">Discounted Price</label>
                <input
                className='formInputSmall' 
                type="number" 
                id="discountedPrice"
                value={discountedPrice}
                onChange={handleMutate}
                min='50'
                max='7500000000'
                required={offer}
                 />
                </>
            )}

            <label className="formLabel">Upload Images</label>
                <p className="imagesInfo">The First Image will be the Cover (max 6).</p> 
                <input
                className='formInputFile' 
                type="file" 
                id="imgs"
                onChange={handleMutate}
                max='6'
                accept='.jpg,.png,.jpeg'
                multiple
                required
                />

            <button type="submit" className="primaryButton createListingButton">Create Listing</button>
            </form>
        </main>
    </div>
  )
}

export default CreateListing