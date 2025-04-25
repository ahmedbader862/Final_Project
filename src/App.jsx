import './App.css';
import Nav from './Components/Nav/Nav';
import Home from './Pages/Home/Home';
import Footer from './Components/Footer/Footer';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
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
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import 'bootstrap-icons/font/bootstrap-icons.css';
import Dishes from './Pages/Dishes/dishes';
import Wishlist from './Pages/Wishlist/wishlist';
import OrderConfirmation from './Pages/OrderConfirmation/OrderConfirmation';
import OrderTracking from './Pages/OrderTracking/OrderTracking';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSelector } from 'react-redux';
import ProtectedRoute from './Pages/ProtectedRoute/ProtectedRoute';
import Banner from './Components/Banner/Banner';
import AdminDashboard from './Pages/AdminDashBoard/AdminDashboard';
import { ThemeProvider } from './Context/ThemeContext';
import Orders from './Pages/Orders/Order';
import SearchResults from './Pages/SearchResults';

// Wrapper component to debug location and conditionally render Nav
const DebugLocation = ({ children }) => {
  const location = useLocation();
  console.log("App.jsx location:", location.pathname);

  // Check if the current path starts with '/admin'
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <>
      {/* Only render Nav and Banner if not on an admin route */}
      {!isAdminRoute && <Banner />}
      {!isAdminRoute && <Nav />}
      {children}
    </>
  );
};

function App() {
  const userState = useSelector((state) => state.UserData['UserState']);

  return (
    <ThemeProvider>
    <BrowserRouter>
      <DebugLocation>
        <div className="min-vh-100 d-flex flex-column">
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
              <Route path="/order-confirmation" element={<OrderConfirmation />} />
              <Route path="/search/:term" element={<SearchResults />} />

              <Route
                path="/track-order"
                element={<OrderTracking userId={userState !== "who know" ? userState.uid : null} />}
              />
              <Route
                path="/orders"
                element={<Orders userId={userState !== "who know" ? userState.uid : null} />}
              />
              <Route path="/admin/*" element={<AdminDashboard />} />
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
      </DebugLocation>
    </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;