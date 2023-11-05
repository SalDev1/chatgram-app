import React from "react";
import { ChatState } from "../Context/ChatProv";
import { Box } from "@chakra-ui/react";
import SingleChat from "./SingleChat";

const ChatBox = ({ fetchAgain, setFetchAgain }) => {
  const { selectedChat } = ChatState();

  return (
    <Box
      display={{ base: selectedChat ? "flex" : "none", md: "flex" }}
      alignItems='center'
      flexDir='column'
      p={3}
      bg='white'
      w={{ base: "100%", md: "68%" }}
      borderRadius='1g'
      borderWidth='1px'>
      <SingleChat setAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </Box>
  );
};

export default ChatBox;
