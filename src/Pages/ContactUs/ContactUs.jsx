import { useSelector } from "react-redux";
import Chat from "../../Components/Chat_Box/chat";
// import FirestoreData from "../../Components/Chat_AI/FirestoreData";
import Chat_AI from "../../Components/Chat_AI/ChatAi";
import FirestoreData from "../../Components/Chat_AI/FirestoreData";
// import BotComponent from "../../Components/Chat_AI/ChatAi";

function ContactUs() {
  const userState55 = useSelector((state) => state.UserData['UserState']);
console.log(userState55.uid);

    return (
        <>
   <br />
   <br />
   <br />
        <Chat
        userName = {"admin"}
        uidChats = {userState55.uid}
        showChat = {true}
        />
        <Chat_AI/>
        
        <FirestoreData/>
        </>
    );

}                
export default ContactUs