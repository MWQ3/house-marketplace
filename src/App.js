import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'
import PrivateRoute from "./components/PrivateRoute";
import Explore from './pages/Explore'
import Category from "./pages/Category";
import Profile from './pages/Profile'
import Offers from './pages/Offers'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import ForgotPWrd from './pages/ForgotPWrd'
import Navbar from "./components/Navbar";
import CreateListing from "./pages/CreateListing";
import Listing from "./pages/Listing";
import Contact from "./pages/Contact";
import EditListing from './pages/EditListing';

function App() {

  return (
    <>
    <Router>
      <Routes>
        <Route path="/" element={ < Explore /> } />
        <Route path="/category/:categoryName" element={ < Category /> } />
        <Route path='/profile' element={ < PrivateRoute /> }>
        <Route path="/profile" element={ < Profile /> } />
        </Route>
        <Route path="/offers" element={ < Offers /> } />
        <Route path={"/sign-in"} element={ < SignIn /> } />
        <Route path="/sign-up" element={ < SignUp /> } />
        <Route path="/forgot-password" element={ < ForgotPWrd /> } />
        <Route path='/create-listing' element={ < CreateListing /> } />
        <Route path='/category/:categoryName/:listingId' element={ < Listing />} />
        <Route path='/contact/:listingOwnerId' element={ < Contact /> } />
        <Route path='/edit-listing/:listingId' element={ < EditListing /> } />
      </Routes>
      < Navbar />
    </Router>

    < ToastContainer />
    </>
  );
}

export default App;
