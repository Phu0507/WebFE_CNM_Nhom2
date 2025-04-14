import React from "react";
import ScrollableFeed from "react-scrollable-feed";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../../config/ChatLogic";
import { ChatState } from "../../context/ChatProvider";
import { Avatar } from "@chakra-ui/react";
import { Tooltip } from "../../components/ui/tooltip";
import { useId, useState } from "react";

const ScrollableChat = ({ messages, recallMessage, deleteMessageForMe }) => {
  const { user } = ChatState();
  const id = useId();
  const [hoveredMsgId, setHoveredMsgId] = useState(null);

  return (
    <ScrollableFeed>
      {messages &&
        messages.map((m, i) => (
          <div style={{ display: "flex" }} key={m._id}>
            {(isSameSender(messages, m, i, user._id) ||
              isLastMessage(messages, i, user._id)) && (
              <Tooltip
                ids={{ trigger: id }}
                content={m.sender.fullName}
                positioning={{ placement: "right-end" }}
              >
                <Avatar.Root
                  ids={{ root: id }}
                  cursor={"pointer"}
                  mt={4}
                  mr={1}
                  size={"md"}
                >
                  <Avatar.Image src={m.sender.avatar} />
                  <Avatar.Fallback name={m.sender.fullName} />
                </Avatar.Root>
              </Tooltip>
            )}

            {/* Bọc span + menu trong div để kiểm soát hover */}
            <div
              style={{
                position: "relative",
                maxWidth: "75%",
                marginLeft: isSameSenderMargin(messages, m, i, user._id),
                marginTop: isSameUser(messages, m, i, user._id) ? 10 : 15,
              }}
              onMouseEnter={() => setHoveredMsgId(m._id)}
              onMouseLeave={() => setHoveredMsgId(null)}
            >
              {/* Nút Xóa / Thu hồi - nằm bên trái khi là tin nhắn của mình */}
              {hoveredMsgId === m._id && m.sender._id === user._id && (
                <div
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "-89px", // chỉnh trái tùy theo khoảng cách mong muốn
                    transform: "translateY(-50%)",
                    display: "flex",
                    gap: "4px",
                  }}
                >
                  <button
                    onClick={() => recallMessage(m._id)}
                    style={{
                      fontSize: "12px",
                      padding: "4px 6px",
                      backgroundColor: "#edf2f7",
                      borderRadius: "5px",
                      cursor: "pointer",
                    }}
                  >
                    Thu hồi
                  </button>
                  <button
                    onClick={() => deleteMessageForMe(m._id)}
                    style={{
                      fontSize: "12px",
                      padding: "4px 6px",
                      backgroundColor: "#fed7d7",
                      borderRadius: "5px",
                      cursor: "pointer",
                    }}
                  >
                    Xóa
                  </button>
                </div>
              )}

              {/* Nội dung tin nhắn */}
              <span
                style={{
                  backgroundColor:
                    m.sender._id === user._id ? "#BEE3F8" : "white",
                  borderRadius: "20px",
                  padding: "5px 15px",
                  display: "inline-block",
                  whiteSpace: "pre-wrap", //  Giữ khoảng trắng và xuống dòng khi cần
                  wordBreak: "break-word", //  Bẻ từ nếu quá dài
                }}
              >
                {m.isRecalled ? (
                  <em style={{ fontStyle: "italic", color: "#A0AEC0" }}>
                    Tin nhắn đã thu hồi
                  </em>
                ) : (
                  m.content
                )}
              </span>
            </div>
          </div>
        ))}
    </ScrollableFeed>
  );
};

export default ScrollableChat;
