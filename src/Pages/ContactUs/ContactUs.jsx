import { useSelector } from "react-redux";
import Chat from "../../Components/Chat_Box/chat";

function ContactUs() {
  const userState55 = useSelector((state) => state.UserData['UserState']);
console.log(userState55.uid);

    return (
        <>

        <Chat
        userName = {"userName"}
        uidChats = {userState55.uid}
        showChat = {true}
        />
        
        </>
    );

}                
export default ContactUs