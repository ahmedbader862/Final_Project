import Chat from '../../Components/Chat_Box/chat';
import './admin.css'
import { 
  db,
  getDocs,
  collection,
  where,
  query,
  
} from '../../firebase/firebase'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';



function Admin() {

  const userState55 = useSelector((state) => state.UserData['UserState']);
  const [alluser, setAllUser] = useState([]);
  const [userName, setUserName] = useState('');
  const [userUID, setUserUID] = useState('');
  const [showChat, setShowChat] = useState(false);

 
  useEffect(() => {
    const getAllUsers = async () => {
      const q = query(collection(db, "users2"), where("uid", "!=", userState55.uid));
      const querySnapshot = await getDocs(q);
      const docsData = [];
      querySnapshot.forEach((doc) => {
        docsData.push({
          id: doc.id,
          ...doc.data()
        });
      });
      setAllUser(docsData);
    };
    getAllUsers();
  }, [userState55.uid]);


  const handleUserData = (user) => {
    setUserName(user.name);
    setUserUID(user.uid);
    setShowChat(true);

  };

  return (
   <>
   <div className='row' >
    <div className="col-md-3 sidebar w-20">
    {alluser.map((user) => (
      <div className='user-card' key={user.id} onClick={() => handleUserData(user)}>
        <h2>{user.name}</h2>
      </div>
    ))}
  </div>
  {console.log(userUID)}
  
   <Chat
   userName = {userName}
   uidChats = {userUID}
   showChat = {showChat}
   />
  </div>
   </>
  );
}

export default Admin;