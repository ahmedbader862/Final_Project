// src/App.js
import './App.css';
import Nav from './Components/Nav/Nav';
import Home from './Pages/Home/Home';
import Footer from './Components/Footer/Footer';
import { BrowserRouter, Routes, Route } from 'react-router-dom'; // Corrected import
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

function App() {
  return (
    <BrowserRouter>
      <div className="min-vh-100 d-flex flex-column">
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
            <Route path="/cart" element={<Cart />} />
            <Route path="/shippingadress" element={<Shipping />} />
            <Route path="*" element={<Error />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
