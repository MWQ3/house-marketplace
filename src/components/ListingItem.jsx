import { Link } from "react-router-dom"
import { ReactComponent as DeleteIcon } from '../assets/svg/deleteIcon.svg'
import BedIcon from '../assets/svg/bedIcon.svg'
import BathtubIcon from '../assets/svg/bathtubIcon.svg'
import { ReactComponent as EditIcon } from '../assets/svg/editIcon.svg'

function ListingItem({ listing, id, handleDelete, handleEdit }) {
  return (
    <li className="categoryListing">
        <Link 
        to={`/category/${listing?.type}/${id}`}
        className="categoryListingLink">
            <img 
            src={listing.imgUrls[0]} 
            alt={listing.name}
            className="categoryListingImg" />

            <div className="categoryListingDetails">
                <p className="categoryListingLocation">{listing.location}</p>

                <p className="categoryListingName">{listing.name}</p>

                <p className="categoryListingPrice">
                    ${listing.offer ? listing.discountedPrice
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                    : listing.regularPrice
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    {listing.type === 'rent' && '/ Month'}
                </p>

                <div className="categoryListingInfoDiv">
                    <img src={BedIcon} alt="Bed" />
                    <p className="categoryListingInfoText">
                        {listing.bedrooms > 1 ? `${listing.bedrooms} Beds` : '1 Bed'}
                    </p>

                    <img src={BathtubIcon} alt="Bathtub" />
                    <p className="categoryListingInfoText">
                        {listing.bathrooms > 1 ? `${listing.bathrooms} Bathrooms` : '1 Bathroom'}
                    </p>
                </div>
            </div>
        </Link>

        {handleDelete && (
                < DeleteIcon 
                className="removeIcon" 
                fill="rgb(231, 76, 60" 
                onClick={() => handleDelete(listing.id, listing.name)} />
            )}

        {handleEdit && (
            < EditIcon
            className="editIcon"
            onClick={() => handleEdit(listing.id)} />
        )}
    </li>
  )
}

export default ListingItem