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
  const [selectedMsgId, setSelectedMsgId] = useState(null);
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
              {hoveredMsgId === m._id && (
                <div
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: m.sender._id === user._id ? "-90px" : "calc(100% + 4px)",
                    transform: "translateY(-50%)",
                    display: "flex",
                    gap: "4px",
                    zIndex: 10,
                  }}
                >
                  {/* Chỉ hiển thị "Thu hồi", "Xóa" nếu là tin nhắn của mình */}
                  {m.sender._id === user._id && (
                    <>
                      <button
                        onClick={() => recallMessage(m._id)}
                        style={{
                          fontSize: "12px",
                          padding: "4px 6px",
                          backgroundColor: "#a0aec0",
                          borderRadius: "5px",
                          cursor: "pointer",
                          whiteSpace: "nowrap",
                        }}
                      >
                        Thu hồi
                      </button>
                      <button
                        onClick={() => deleteMessageForMe(m._id)}
                        style={{
                          fontSize: "12px",
                          padding: "4px 6px",
                          backgroundColor: "#fc8181",
                          borderRadius: "5px",
                          cursor: "pointer",
                          whiteSpace: "nowrap",
                        }}
                      >
                        Xóa
                      </button>
                    </>
                  )}


                </div>
              )}

              <div
                onClick={() =>
                  setSelectedMsgId(selectedMsgId === m._id ? null : m._id)
                }
                style={{
                  backgroundColor: m.sender._id === user._id ? "#BEE3F8" : "white",
                  borderRadius: "20px",
                  padding: "10px 15px",
                  display: "inline-block",
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                  cursor: "pointer",
                }}
              >
                {m.isRecalled ? (
                  <em style={{ fontStyle: "italic", color: "#A0AEC0" }}>
                    Tin nhắn đã thu hồi
                  </em>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    {/* Text nếu có */}
                    {m.content && <span>{m.content}</span>}

                    {/* Ảnh nếu là ảnh */}
                    {m.type === "image" && m.fileUrl && (
                      <img
                        src={m.fileUrl}
                        alt="image"
                        onClick={(e) => {
                          e.stopPropagation(); // không toggle thời gian
                          window.open(m.fileUrl, "_blank");
                        }}
                        style={{
                          width: "160px",
                          height: "160px",
                          objectFit: "cover",
                          borderRadius: "10px",
                          cursor: "pointer",
                          transition: "transform 0.2s",
                        }}
                        onMouseOver={(e) =>
                          (e.currentTarget.style.transform = "scale(1.03)")
                        }
                        onMouseOut={(e) =>
                          (e.currentTarget.style.transform = "scale(1)")
                        }
                      />
                    )}

                    {/* File nếu là file đính kèm */}
                    {m.type === "file" && m.fileUrl &&
                      (() => {
                        const fileName = decodeURIComponent(m.fileUrl.split("/").pop());
                        const extension = fileName.split(".").pop().toLowerCase();
                        const fileIcons = {
                          pdf: "📄",
                          doc: "📄",
                          docx: "📄",
                          xls: "📊",
                          xlsx: "📊",
                          ppt: "📽️",
                          pptx: "📽️",
                          rar: "🗜️",
                          zip: "🗜️",
                          txt: "📄",
                          mp3: "🎵",
                          mp4: "🎞️",
                          default: "📎",
                        };
                        const icon = fileIcons[extension] || fileIcons.default;

                        return (
                          <a
                            href={m.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            style={{
                              color: "#3182CE",
                              textDecoration: "underline",
                              fontSize: "14px",
                              display: "flex",
                              alignItems: "center",
                              gap: "4px",
                            }}
                          >
                            <span style={{ fontSize: "18px" }}>{icon}</span>
                            {fileName}
                          </a>
                        );
                      })()}
                  </div>
                )}

                {/* Timeline nếu là tin nhắn đang được chọn */}
                {selectedMsgId === m._id && (
                  <div
                    style={{
                      marginTop: "5px",
                      fontSize: "12px",
                      color: "#718096",
                      textAlign: "right",
                    }}
                  >
                    {new Date(m.createdAt).toLocaleTimeString("vi-VN", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}{" "}
                    •{" "}
                    {new Date(m.createdAt).toLocaleDateString("vi-VN", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
                  </div>
                )}
              </div>


            </div>
          </div>
        ))}
    </ScrollableFeed>
  );
};

export default ScrollableChat;
