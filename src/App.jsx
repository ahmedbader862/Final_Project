import './App.css';
import Nav from './Components/Nav/Nav';
import Home from './Pages/Home/Home';
import Footer from './Components/Footer/Footer';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import WelcomePage from './Pages/Welcome/Welcome';
import Error from './Pages/Error/Error';
import Menu from './Pages/Menu/Menu';
import Reservation from './Pages/Reservation/Reservation';
import ContactUs from './Pages/ContactUs/ContactUs';
import Register from './Pages/Register/Register';
import Signin from './Pages/Sign in/signIn';
import Cart from './Pages/Cart/Cart';
import Shipping from './Pages/Shipping/Shipping';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Dishes from './Pages/Dishes/dishes';
import Wishlist from './Pages/Wishlist/wishlist';
import AdminPage from './Pages/AdminOrder/AdminPage';
import Admin from './Pages/Admin_two/admin';
import OrderConfirmation from './Pages/OrderConfirmation/OrderConfirmation';
import OrderTracking from './Pages/OrderTracking/OrderTracking';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSelector } from 'react-redux';
import ProtectedRoute from './Pages/ProtectedRoute/ProtectedRoute';
import Banner from './Components/Banner/Banner'; // Already imported
import AdminControl from './Pages/AdminControl/AdminControl';
function App() {
  const userState = useSelector((state) => state.UserData['UserState']);

  return (
    <BrowserRouter>
      <div className="min-vh-100 d-flex flex-column">

        <Banner />
        <Nav />
        <main className="flex-grow-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/signin" element={<Signin />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/Dishes/:id" element={<Dishes />} />
            <Route path="/reservation" element={<Reservation />} />
            <Route path="/contactus" element={<ContactUs />} />
            <Route path="/welcome" element={<WelcomePage />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/cart" element={<ProtectedRoute element={Cart} />} />
            <Route path="/shippingadress" element={<Shipping />} />
            <Route path="/adminorder" element={<AdminPage />} />
            <Route path="/AdminControl" element={<AdminControl />} />
            <Route path="/admin/:uid" element={<Admin />} />
            <Route path="/order-confirmation" element={<OrderConfirmation />} />
            <Route
              path="/track-order"
              element={<OrderTracking userId={userState !== "who know" ? userState.uid : null} />}
            />
            <Route path="*" element={<Error />} />
          </Routes>
        </main>
        <Footer />
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </div>
    </BrowserRouter>
  );
}

export default App;
