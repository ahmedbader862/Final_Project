import './App.css'
import Nav from './Components/Nav/Nav'
import Home from './Pages/Home/Home'
import Footer from './Components/Footer/Footer'
import { BrowserRouter, Route, Router, Routes } from 'react-router-dom'
import WelcomePage from './Pages/Welcome/Welcome'
import Error from './Pages/Error/Error'
import Menu from './Pages/Menu/Menu'
import Reservation from './Pages/Reservation/Reservation'
import ContactUs from './Pages/ContactUs/ContactUs'
import Register from './Pages/Register/Register'


function App() {
  

  return (
    <>
    <BrowserRouter>
      <Nav/>

      <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/menu" element={<Menu />} />
      <Route path="/reservation" element={<Reservation />} />
      <Route path="/contactus" element={<ContactUs />} />
      <Route path="/welcome" element={<WelcomePage />} />
      <Route path="/Register" element={<Register />} />
      <Route path="*" element={<Error />} />

      </Routes>
      <Footer/>
    </BrowserRouter>
    </>
  )
}

export default App
