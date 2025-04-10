import "bootstrap/dist/css/bootstrap.min.css";
import "./Home.css"; // Custom CSS for animations and styling
import Chefs from "../../Components/chefs/Chefs";
import Grid from "../../Components/Grid/Grid";
import Hero from "../../Components/Hero/Hero";
import Counter from "../../Components/Counter/Counter";
import Contact from "../../Components/General_Contacts/General_Contacts";

function Home() {
  return(
  <>
  <Hero/>
      
      <Counter/>
      <Contact/>
    </>
  )
}

export default Home;