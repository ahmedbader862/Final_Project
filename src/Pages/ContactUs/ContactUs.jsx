import { useSelector } from "react-redux";
import Chat from "../../Components/Chat_Box/chat";

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
        
        </>
    );

}                
export default ContactUs