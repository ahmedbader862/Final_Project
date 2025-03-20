import './admin.css'
import { 
    db,
    getDocs,
    collection,
    where,
    query,
    // getDatabase,
    // ref,
    // set
  } from '../../firebase/firebase'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
function Admin() {
 
const userState55 = useSelector((state) => state.UserData['UserState']);
  
const [alluser, setAllUser] = useState([])

const [userName , setUserName] = useState('')
const [userUID , setUserUID] = useState('')
const [showChat , setShowChat] = useState(false)  
const [inputChat , setInputChat] = useState('')


  useEffect(() => {
     const getAllUsers = async () => {
        const q = query(collection(db, "users2"), where("uid", "!=", userState55.uid));
       const querySnapshot = await getDocs(q)
       
       const docsData = []
       querySnapshot.forEach((doc) => {
         docsData.push({
           id: doc.id,
           ...doc.data()
         })
       })
       setAllUser(docsData)
       console.log(docsData);
       
     }
     getAllUsers()
    }, [userState55.uid]);

   const handleUserData = (user) => {
    setUserName(user.name);
    setUserUID(user.uid);
    setShowChat(true);
    // console.log(userUID);
    // console.log(userName);
    console.log(userState55.uid);

  };

  const handleInputChat = (e) => {
   setInputChat(e.target.value)
   console.log(inputChat);
   
  };



  // &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&7



  return (
    <>

  {
      alluser.map((user)=>(
       <div className='card bg-danger' key={user.id} onClick={()=>handleUserData(user)} >
         <h1>{user.name}</h1>
         </div>
      ))
    }

    {
     showChat == true &&
     <>
     <h1>ssssssssssssssssssssssss</h1>
     <h1>{userName}</h1>
     <h1>{userUID}</h1>
     <div className='row'>
      <input type="text" onChange={handleInputChat} />
      <button className='btn bg-info'>send</button>
     </div>
     </>
    }
    </>
  )
}

export default Admin