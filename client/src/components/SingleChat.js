import React, { useEffect, useState } from "react";
import { ChatState } from "../Context/ChatProv";
import {
  Box,
  FormControl,
  IconButton,
  Input,
  Spinner,
  Text,
  useToast,
} from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { getSender, getSenderFull } from "../config/ChatLogics";
import Profile from "./Profile";
import UpdateGroupChatModal from "./UpdateGroupChatModal";
import axios from "axios";
import "./style.css";
import ScrollableChat from "./ScrollableChat";
import { io } from "socket.io-client";
import Lottie from "lottie-react";
import TypingAnimation from "../animations/typing.json";

// const ENDPOINT = "http://localhost:8080";
const ENDPOINT = "https://chatgram-o5lh.onrender.com";
var socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const {
    user,
    selectedChat,
    setSelectedChat,
    notifications,
    setNotifications,
  } = ChatState();

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const [checkMessage, setCheckMessage] = useState(false);
  const [newMessage, setNewMessage] = useState("");

  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: TypingAnimation,
    rendererSettings: {
      preserveAspectRatio: "XMidYMid slice",
    },
  };

  const toast = useToast();

  // console.log(`Client Side ${socket?.id}`);

  // const a = localStorage.getItem("userInfo");
  // console.log(a);
  // console.log(messages);

  const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      const config = {
        headers: {
          // "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };

      setLoading(true);
      const { data } = await axios.get(
        `/api/message/${selectedChat._id}`,
        config
      );

      // console.log(data);
      setMessages(data);
      setLoading(false);
      // Emitting the signal to join the room  , this is tthe instance of socket called join_chat.
      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      toast({
        title: "Error Occured !",
        description: "Failed to Load the Messages",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  const sendMessage = async (e) => {
    if (e.key === "Enter" && newMessage) {
      // socket.emit("stop typing");

      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };

        const { data } = await axios.post(
          "/api/message",
          {
            content: newMessage,
            chatId: selectedChat._id,
          },
          config
        );
        console.log(data);

        // I will be not getting chat + sender details until I hit reload.
        socket.emit("new message", {
          chatData: data,
          userInfo: user,
          selectedChat: selectedChat,
        });

        setMessages([...messages, data]);
        setNewMessage("");
        setCheckMessage(true);
      } catch (error) {
        toast({
          title: "Error Occured!",
          description: "Failed to send the Message",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    }
  };
  // Starting the socket io connection in the client state.
  // This is how socket io connection between client and server is been builded.
  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
  }, []);

  useEffect(() => {
    fetchMessages();

    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  console.log(notifications);

  useEffect(() => {
    // I take the information of message received.
    console.log("This working..");
    socket.on("message received", (newMessageReceived) => {
      console.log(newMessageReceived);

      if (
        !selectedChat ||
        selectedChatCompare._id !== newMessageReceived.chatData._id
      ) {
        // // give notifications
        if (!notifications.includes(newMessageReceived)) {
          setNotifications([...notifications, newMessageReceived]);
          setFetchAgain(!fetchAgain);
        }
      }
      setMessages([...messages, newMessageReceived.chatData]);
    });
  });

  useEffect(() => {
    if (checkMessage) {
      fetchMessages();
      setCheckMessage(false);
    }
  });

  const typingHandler = (e) => {
    setNewMessage(e.target.value);
    // Typing Indicator Logic.

    if (!socketConnected) return;

    // If we are not typing , set the typing to true.
    if (!typing) {
      setTyping(true);
      // Sending back the signal to the server in the current chat room.
      socket.emit("typing", {
        selectedChat: selectedChat,
        user: user,
      });
    }

    // Logic for typing indicator.
    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;

      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", {
          selectedChat: selectedChat,
          user: user,
        });
        setTyping(false);
      }
    }, timerLength);
  };

  // console.log(selectedChat.chatName);
  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "28px", md: " 30px" }}
            pb={3}
            px={2}
            w='100%'
            fontFamily='Work Sans'
            display='flex'
            justifyContent={{ base: "space-between" }}
            alignItems='center'>
            <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
            />
            {messages && !selectedChat.isGroupChat ? (
              // If the chat is not a groupChat , display your friends name in the heading.
              <>
                {getSender(user, selectedChat.users)}

                {/* Sending out the entire user object of my friend details to this component */}
                <Profile user={getSenderFull(user, selectedChat.users)} />
              </>
            ) : (
              <>
                {selectedChat.chatName.toUpperCase()}
                <UpdateGroupChatModal
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                  fetchMessages={fetchMessages}
                />
              </>
            )}
          </Text>
          <Box
            display='flex'
            flexDir='column'
            justifyContent='flex-end'
            p={3}
            bg='#E8E8E8'
            w='100%'
            h='100%'
            borderRadius='lg'
            overflowY='hidden'>
            {loading ? (
              <>
                <Spinner
                  size='xl'
                  w={20}
                  h={20}
                  alignSelf='center'
                  margin='auto'
                />
              </>
            ) : (
              <div className='messages'>
                <ScrollableChat messages={messages} />
              </div>
            )}

            <FormControl onKeyDown={sendMessage} isRequired mt={3}>
              {isTyping ? (
                <Box width='14' py={2}>
                  <Lottie
                    animationData={TypingAnimation}
                    loop={true}
                    size={2}
                  />
                </Box>
              ) : (
                <></>
              )}
              <Input
                variant='filled'
                bg='#E0E0E0'
                onChange={typingHandler}
                placeholder='Enter a message.'
                value={newMessage}
              />
            </FormControl>
          </Box>
        </>
      ) : (
        <>
          <Box
            display='flex'
            alignItems='center'
            justifyContent='center'
            h='100%'>
            <Text fontSize='3xl' pb={3} fontFamily='Work Sans'>
              Click on a user to start chatting
            </Text>
          </Box>
        </>
      )}
    </>
  );
};

export default SingleChat;
