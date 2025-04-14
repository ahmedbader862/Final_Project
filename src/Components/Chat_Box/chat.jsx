import { dbR, ref, push, onValue } from '../../firebase/firebase';
import { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useSelector } from 'react-redux';
import './Chat.css';

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

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="chat-wrapper cht">
      <div className="container ">
        <div className="row justify-content-center">
          <div className="col-md-9 chat-container">
            {props.showChat && (
              <>
                <h1 className="text-white mb-4">Chat with {props.userName}</h1>
                <div className="chat-box shadow-lg">
                  <div className="messages p-3">
                    {chatTexts.length > 0 ? (
                      chatTexts.map((msg) => (
                        <div
                          key={msg.id}
                          className={`message mb-3 ${
                            msg.sender === userState55.uid ? 'sent' : 'received'
                          }`}
                        >
                          <div className="message-content p-3 rounded">
                            <p className="mb-1">{msg.message}</p>
                            <small className="text-black fw-bolder">
                              {formatTimestamp(msg.timestamp)}
                            </small>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-center text-muted">No messages yet. Start the conversation!</p>
                    )}
                  </div>
                  <div className="input-area p-3 border-top">
                    <div className="d-flex align-items-center">
                      <input
                        type="text"
                        className="form-control me-2"
                        placeholder="Type your message..."
                        onChange={handleInputChat}
                        value={inputChat}
                        onKeyPress={(e) => e.key === 'Enter' && writeUserMSG()}
                      />
                      <button className="btn btn-primary px-3" onClick={writeUserMSG}>
                        Send
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