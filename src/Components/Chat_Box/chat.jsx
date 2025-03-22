import { 
    dbR,
    ref,
    push,
    onValue,
  } from '../../firebase/firebase'
import { useEffect, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { useSelector } from 'react-redux';

function Chat(props) {
  const userState55 = useSelector((state) => state.UserData['UserState']);
  const [inputChat, setInputChat] = useState('');
  const [chatTexts, setChatTexts] = useState([]);

  const handleInputChat = (e) => {
    setInputChat(e.target.value);
  };

  const writeUserMSG = () => {
    const messagesRef = ref(dbR, `chat admin/${props.uidChats}`);

    const newMessage = {
      message: inputChat,
      timestamp: new Date().getTime(), 
      sender: userState55.uid,         
    };
    push(messagesRef, newMessage);

    setInputChat(''); 
  };

  useEffect(() => {
    const messagesRef = ref(dbR, `chat admin/${props.uidChats}`);
    const unsubscribe = onValue(messagesRef, (snapshot) => {
      const messages = snapshot.val();
      if (messages) {
        const msgsArray = Object.keys(messages).map(key => messages[key]);
        setChatTexts(msgsArray);
      } else {
        setChatTexts([]);
      }
    });

    return () => unsubscribe();
  }, [props.uidChats]);

  return (
    <div className=" container-fluid" >
      <div className="row">
        <div className="col-md-9 chat-container">
          {props.showChat && (
            <>
              <h1>Chat with {props.userName}</h1>
              <div className='chat-box'>
                <div className='messages'>
                  {chatTexts.map((msg, index) => (
                    <div key={index} className={`message ${msg.sender === userState55.uid ? 'bg-info' : 'bg-danger'}`}>
                      <p>{msg.message}</p>
                    </div>
                  ))}
                </div>
                <div className='input-area mt-3'>
                  <input type="text" className="form-control" onChange={handleInputChat} value={inputChat} />
                  <button className='btn btn-info ml-2' onClick={writeUserMSG}>Send</button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Chat;