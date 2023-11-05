import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// Context API --> helps us maintain a global state management --> Redux State Management
// It is sort of one big container when we store and fetch data as per our needs.
const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const [user, setUser] = useState();
  const [selectedChat, setSelectedChat] = useState();
  const [chats, setChats] = useState([]);
  const [notifications, setNotifications] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    setUser(userInfo);

    if (!userInfo) {
      navigate("/");
    }
  }, [navigate]);

  return (
    <ChatContext.Provider
      value={{
        user,
        setUser,
        selectedChat,
        setSelectedChat,
        chats,
        setChats,
        notifications,
        setNotifications,
      }}>
      {children}
    </ChatContext.Provider>
  );
};

// This function helps us access the whole chat state throughout the app.
export const ChatState = () => {
  return useContext(ChatContext);
};

export default ChatProvider;
