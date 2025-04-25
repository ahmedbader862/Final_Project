import { dbR, ref, push, onValue } from '../../firebase/firebase';
import { useEffect, useState, useContext } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useSelector } from "react-redux";
import './Chat.css';
import { ThemeContext } from '../../Context/ThemeContext';

function Chat(props) {
  const { theme } = useContext(ThemeContext);
  const isDark = theme === "dark";
  const textColor = isDark ? "text-white" : "text-dark";
  const bgColor = isDark ? "bg-custom-dark" : "bg-light";
  const bgChatColor = isDark ? "bg-dark" : "bg-light";
  const inputBg = isDark ? "bg-dark text-white border-secondary" : "bg-white text-dark border-dark";
  const btnStyle = isDark ? "btn btn-outline-light" : "btn btn-outline-dark";
  const msgSent = isDark ? "bg-primary text-white" : "bg-primary text-white";
  const msgReceived = isDark ? "bg-secondary text-white" : "bg-light text-dark";

  const userState55 = useSelector((state) => state.UserData['UserState']);
  const currentLange = useSelector((state) => state.lange.langue);
  const text = useSelector((state) => state.lange[currentLange.toLowerCase()]);
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

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={`chat-wrapper cht py-4 ${bgColor}`}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-9 chat-container">
            {props.showChat && (
              <>
                <h1 className={`mb-4 ${textColor}`}>{text.chatWith}</h1>
                <div className={`chat-box shadow-lg rounded ${bgChatColor}`}>
                  <div className={`messages p-3`} style={{ maxHeight: '400px', overflowY: 'auto' }}>
                    {chatTexts.length > 0 ? (
                      chatTexts.map((msg, index) => (
                        <div
                          key={index}
                          className={`message mb-3 ${msg.sender === userState55.uid ? 'sent text-end' : 'received text-start'}`}
                        >
                          <div className={`message-content p-3 rounded ${msg.sender === userState55.uid ? msgSent : msgReceived}`}>
                            <p className="mb-1">{msg.message}</p>
                            <small className="fw-bolder d-block">{formatTimestamp(msg.timestamp)}</small>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-center text-muted">{text.noMessages}</p>
                    )}
                  </div>

                  <div className={`input-area p-3 border-top ${bgColor}`}>
                    <div className="d-flex align-items-center">
                      <input
                        type="text"
                        className={`form-control  ${inputBg}`}
                        placeholder={text.typeMessage}
                        onChange={handleInputChat}
                        value={inputChat}
                        onKeyPress={(e) => e.key === 'Enter' && writeUserMSG()}
                      />
                      <button className={`${btnStyle} px-3`} onClick={writeUserMSG}>
                        {text.sendButton}
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chat;
