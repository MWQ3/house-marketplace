import { Link } from "react-router-dom"
import rentImgCategory from '../assets/jpg/rentCategoryImage.jpg'
import  sellImgCategory from '../assets/jpg/sellCategoryImage.jpg'
import Slider from "../components/Slider"

function Explore() {
  return (
    <div className="explore">
      <header>
        <p className="pageHeader">Explore</p>
      </header>

      <main>

       < Slider />

          <p className="exploreCategoryHeading">Categories</p>
        <div className="exploreCategories">

          <div className="rentLinkDiv">
          <Link to='/category/rent'>
            <img 
            src={rentImgCategory} 
            alt="Rent"
            className="exploreCategoryImg" />
          </Link>
            <p className="exploreCategoryName">Rent</p>
          </div>

          <div className="sellLinkDiv">
          <Link to='/category/sale'>
            <img 
            src={sellImgCategory} 
            alt="Sell"
            className="exploreCategoryImg" />
          </Link>
            <p className="exploreCategoryName">Sell</p>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Explore