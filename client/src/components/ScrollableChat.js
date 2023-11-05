import React from "react";
import ScrollableFeed from "react-scrollable-feed";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../config/ChatLogics";
import { ChatState } from "../Context/ChatProv";
import { Avatar, Tooltip } from "@chakra-ui/react";

const ScrollableChat = ({ messages }) => {
  const { user } = ChatState();

  console.log(messages);
  // console.log(messages[0]?.sender._id);

  return (
    <ScrollableFeed>
      {messages &&
        messages?.map((m, i) => (
          <div style={{ display: "flex" }} key={i}>
            {isSameSender(messages, m, i, user._id) ||
              (isLastMessage(messages, i, user._id) && (
                <Tooltip
                  label={m.sender.name}
                  placement='bottom-start'
                  hasArrow>
                  <Avatar
                    mt='7px'
                    mr={1}
                    sz='sm'
                    cursor='pointer'
                    name={m.sender.name}
                    src={m.sender.pic}
                  />
                </Tooltip>
              ))}
            <span
              style={{
                backgroundColor: `${
                  m.sender._id === user._id || m.sender === user.id
                    ? "lightblue"
                    : "lightgreen"
                }`,
                borderRadius: "20px",
                padding: "5px 15px",
                maxWidth: "75%",
                marginLeft: isSameSenderMargin(messages, m, i, user._id),
                marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10,
              }}>
              {m.content}
            </span>
          </div>
        ))}
    </ScrollableFeed>
  );
};

export default ScrollableChat;
