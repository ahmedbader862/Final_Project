import { useState , useEffect } from 'react';
import { 
  db,
  getDocs,
  collection
  
} from '../../firebase/firebase'
import { useNavigate } from 'react-router-dom';

function Menu() {
  
  const navigate = useNavigate();

  const [userCategures, setUserCategures] = useState([])
 
  useEffect(() => {
    const getAllDocs = async () => {
      const querySnapshot = await getDocs(collection(db, "menu"))
      const docsData = []
      querySnapshot.forEach((doc) => {
        docsData.push({
          id: doc.id,
          ...doc.data()
        })
      })
      setUserCategures(docsData)
    }
    getAllDocs()
  }, []) 

  // &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&7

  const handelnavigate = (id)=>{
    console.log("fffffffffff"+id);
    // Navigate(`/Dishes`);
    navigate(`/Dishes/${id}`);
    
  };

  return (
    <>

      <h1>Menu Categories</h1>
  
        
            
    {
      userCategures.map((hh)=>(
       <div className='card bg-danger' key={hh.id} onClick={ () => handelnavigate(hh.id)} >
         <h1>{hh.id}</h1>
         </div>
      ))
    }
         
       
     
    </>
  )
}

export default Menu