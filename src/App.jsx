import './App.css'
import Nav from './Components/Nav/Nav'
import Home from './Pages/Home/Home'
import { BrowserRouter , Route,  Routes } from 'react-router-dom'
import Register from './Pages/Register/Register'
import Signin from './Pages/Sign in/signIn'


function App() {
  

  return (
    <>

    <BrowserRouter>
     <Nav />
      <Routes>
        
        <Route path="/" element={<Home />} />
        <Route path="/Register" element={<Register />} />
        <Route path="/Signin" element={<Signin />} />

      </Routes>

    </BrowserRouter>

      
    </>
  )
}

export default App
