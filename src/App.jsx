import './App.css'
import Nav from './Components/Nav/Nav'
import Home from './Pages/Home/Home'
import { BrowserRouter , Route,  Routes } from 'react-router-dom'
import Register from './Pages/Register/Register'


function App() {
  

  return (
    <>

    <BrowserRouter>
     <Nav />
      <Routes>
        
        <Route path="/" element={<Home />} />
        <Route path="/Register" element={<Register />} />

      </Routes>

    </BrowserRouter>

      
    </>
  )
}

export default App
