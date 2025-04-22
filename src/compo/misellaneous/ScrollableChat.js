import axios from "axios";
import React, { useEffect } from "react";
import ScrollableFeed from "react-scrollable-feed";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
  shouldShowTimestamp,
  getDateLabel,
} from "../../config/ChatLogic";
import { ChatState } from "../../context/ChatProvider";
import { Avatar, Input } from "@chakra-ui/react";
import { useId, useState } from "react";
import socket from "../../context/socket";
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css"; // Nhớ import CSS để Lightbox hoạt động
import { VStack, HStack } from "@chakra-ui/react";
import { RiDownload2Line } from "react-icons/ri";
import { FaDownload } from "react-icons/fa";
import Linkify from "linkify-react";

const ScrollableChat = ({
  messages,
  recallMessage,
  deleteMessageForMe,
  setMessages,
}) => {
  const { user } = ChatState();
  // const id = useId();
  const [hoveredMsgId, setHoveredMsgId] = useState(null);
  const [editingMessage, setEditingMessage] = useState(null);
  const [newContent, setNewContent] = useState("");

  const [isOpen, setIsOpen] = useState(false); // Mở lightbox
  const [photoIndex, setPhotoIndex] = useState(0); // Chỉ số ảnh trong lightbox
  let shownDates = new Set();
  const handleEditMessage = (message) => {
    setEditingMessage(message);
    setNewContent(message.content);
  };

  const handleSaveEditedMessage = async () => {
    if (newContent.trim() === "") return; // Kiểm tra nếu nội dung trống

    try {
      const response = await axios.put(
        `http://localhost:5000/api/message/edit/${editingMessage._id}`, // Đường dẫn API chỉnh sửa tin nhắn
        { content: newContent }, // Gửi nội dung mới
        { headers: { Authorization: `Bearer ${user.token}` } } // Đảm bảo rằng token được truyền vào header
      );
      console.log("Response from API:", response);

      if (response.status === 200) {
        const updatedMessages = messages.map((message) =>
          message._id === editingMessage._id
            ? { ...message, content: newContent, isEdited: true } // Cập nhật nội dung tin nhắn
            : message
        );

        setMessages(updatedMessages); // Cập nhật lại danh sách tin nhắn
        socket.emit("messageEdited", response.data);
        setEditingMessage(null);
        setNewContent("");
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật tin nhắn:", error);
      alert(
        `Lỗi cập nhật tin nhắn.${JSON.stringify(
          error.response?.data || error.message
        )}`
      );
    }
  };
  useEffect(() => {
    const handleEdit = (updatedMsg) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === updatedMsg._id ? { ...msg, ...updatedMsg } : msg
        )
      );
    };
    socket.on("messageEdited", handleEdit);
    return () => {
      socket.off("messageEdited", handleEdit); // 👈 GỠ BỎ
    };
  });

  const imageMessages = messages.filter(
    (msg) => msg.type === "image" && msg.fileUrl && !msg.isRecalled
  );

  return (
    <ScrollableFeed>
      {messages &&
        messages.map((m, i) => {
          const messageDate = new Date(m.createdAt);
          const label = getDateLabel(messageDate);

          const shouldShowDate = !shownDates.has(label); // chỉ hiển thị nếu chưa hiện label này

          if (shouldShowDate) shownDates.add(label);

          return (
            <React.Fragment key={m._id}>
              {shouldShowDate && (
                <div style={{ textAlign: "center" }}>
                  <div
                    style={{
                      display: "inline-block",
                      margin: "20px 0",
                      fontSize: "14px",
                      color: "white",
                      backgroundColor: "gray",
                      padding: "4px 10px",
                      borderRadius: "20px",
                    }}
                  >
                    {label}
                  </div>
                </div>
              )}
              <HStack key={m._id} gap={0} align={"flex-end"}>
                {(isSameSender(messages, m, i, user._id) ||
                  isLastMessage(messages, i, user._id)) && (
                  <Avatar.Root cursor={"pointer"} mr={1} size={"md"}>
                    <Avatar.Image src={m.sender.avatar} />
                    <Avatar.Fallback name={m.sender.fullName} />
                  </Avatar.Root>
                )}

                {/* Bọc span + menu trong div để kiểm soát hover */}
                <div
                  style={{
                    maxWidth: "75%",
                    marginLeft: isSameSenderMargin(messages, m, i, user._id),
                    marginTop: isSameUser(messages, m, i, user._id) ? 10 : 15,
                    // backgroundColor: "red",
                    display: "flex",
                    alignItems: "flex-end",
                  }}
                  onMouseEnter={() => setHoveredMsgId(m._id)}
                  onMouseLeave={() => setHoveredMsgId(null)}
                >
                  {hoveredMsgId === m._id && m.sender._id === user._id && (
                    <div
                      style={{
                        display: "flex",
                        gap: "6px",
                        marginBottom: "6px",
                        marginRight: "4px",
                      }}
                    >
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
                      <button
                        onClick={() => handleEditMessage(m)}
                        style={{
                          fontSize: "12px",
                          padding: "4px 6px",
                          backgroundColor: "#90cdf4",
                          borderRadius: "5px",
                          cursor: "pointer",
                          whiteSpace: "nowrap",
                        }}
                      >
                        Chỉnh sửa
                      </button>
                    </div>
                  )}
                  <VStack gap={0} align="flex-start">
                    <div
                      style={{
                        backgroundColor:
                          m.sender._id === user._id ? "#BEE3F8" : "white",
                        borderRadius: "5px",
                        padding: "5px 10px",
                        display: "inline-block",
                        whiteSpace: "pre-wrap",
                        wordBreak: "break-word",
                      }}
                    >
                      {m.isRecalled ? (
                        <em style={{ fontStyle: "italic", color: "#A0AEC0" }}>
                          Tin nhắn đã thu hồi
                        </em>
                      ) : (
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "6px",
                          }}
                        >
                          {/* Text nếu có */}
                          {editingMessage?._id === m._id ? (
                            <>
                              <Input
                                value={newContent}
                                onChange={(e) => setNewContent(e.target.value)}
                                style={{
                                  width: "100%",
                                  padding: "8px",
                                  borderRadius: "8px",
                                  border: "1px solid #ccc",
                                  fontSize: "14px",
                                  backgroundColor: "white",
                                }}
                              />
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "flex-end",
                                  gap: "8px",
                                  marginTop: "5px",
                                }}
                              >
                                <button
                                  onClick={handleSaveEditedMessage}
                                  style={{
                                    backgroundColor: "#3182CE",
                                    color: "white",
                                    padding: "6px 12px",
                                    borderRadius: "5px",
                                    fontSize: "13px",
                                  }}
                                >
                                  Lưu
                                </button>
                                <button
                                  onClick={() => {
                                    setEditingMessage(null);
                                    setNewContent("");
                                  }}
                                  style={{
                                    backgroundColor: "#e53e3e",
                                    color: "white",
                                    padding: "6px 12px",
                                    borderRadius: "5px",
                                    fontSize: "13px",
                                  }}
                                >
                                  Hủy
                                </button>
                              </div>
                            </>
                          ) : (
                            <>
                              <Linkify
                                options={{
                                  target: "_blank",
                                  rel: "noopener noreferrer",
                                  className: "link-style",
                                }}
                              >
                                {m.content}
                              </Linkify>
                              <style>
                                {`
                                .link-style {
                                    color: #3182ce;
                                    text-decoration: underline;
                                  }
                              `}
                              </style>
                              {m.isEdited && (
                                <span
                                  style={{
                                    fontSize: "11px",
                                    color: "#718096",
                                  }}
                                >
                                  (Đã chỉnh sửa)
                                </span>
                              )}
                            </>
                          )}

                          {/* Ảnh nếu là ảnh */}
                          {m.type === "image" && m.fileUrl && (
                            <>
                              <img
                                src={m.fileUrl}
                                alt="image"
                                onClick={() => {
                                  const index = imageMessages.findIndex(
                                    (img) => img._id === m._id
                                  );
                                  setPhotoIndex(index);
                                  setIsOpen(true);
                                }}
                                style={{
                                  maxWidth: "500px",
                                  width: "100%",
                                  height: "250px",
                                  objectFit: "cover",
                                  borderRadius: "5px",
                                  cursor: "pointer",
                                }}
                              />

                              {/* Nút tải ảnh */}
                              <div
                                style={{
                                  textAlign:
                                    m.sender._id === user._id
                                      ? "left"
                                      : "right",
                                }}
                              >
                                <a
                                  href={m.fileUrl}
                                  download
                                  style={{
                                    color: "#3182CE",
                                    textDecoration: "underline",
                                    cursor: "pointer",
                                    display: "inline-block",
                                  }}
                                >
                                  <RiDownload2Line size={20} />
                                </a>
                              </div>

                              {/* Lightbox */}
                              {isOpen && (
                                <Lightbox
                                  mainSrc={imageMessages[photoIndex].fileUrl}
                                  nextSrc={
                                    photoIndex < imageMessages.length - 1
                                      ? imageMessages[photoIndex + 1].fileUrl
                                      : undefined
                                  }
                                  prevSrc={
                                    photoIndex > 0
                                      ? imageMessages[photoIndex - 1].fileUrl
                                      : undefined
                                  }
                                  onCloseRequest={() => setIsOpen(false)}
                                  onMovePrevRequest={() =>
                                    photoIndex > 0 &&
                                    setPhotoIndex(photoIndex - 1)
                                  }
                                  onMoveNextRequest={() =>
                                    photoIndex < imageMessages.length - 1 &&
                                    setPhotoIndex(photoIndex + 1)
                                  }
                                  imageTitle={`Ảnh từ nhóm: ${imageMessages[photoIndex].chat.chatName}`}
                                  imageCaption={`Gửi bởi: ${imageMessages[photoIndex].sender.fullName}`}
                                />
                              )}
                            </>
                          )}

                          {m.type === "video" && m.fileUrl && (
                            <video
                              controls
                              style={{
                                maxWidth: "400px",
                                width: "100%",
                                height: "500px",
                                objectFit: "cover",
                              }}
                            >
                              <source src={m.fileUrl} type="video/mp4" />
                              Trình duyệt của bạn không hỗ trợ video.
                            </video>
                          )}
                          {m.type === "audio" && m.fileUrl && (
                            <audio controls src={m.fileUrl}>
                              Trình duyệt không hỗ trợ phát âm thanh.
                            </audio>
                          )}
                          {/* File nếu là file đính kèm */}
                          {m.type === "file" &&
                            m.fileUrl &&
                            (() => {
                              const fileName = decodeURIComponent(
                                m.fileUrl.split("/").pop()
                              );
                              const extension = fileName
                                .split(".")
                                .pop()
                                .toLowerCase();
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
                              const icon =
                                fileIcons[extension] || fileIcons.default;

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
                                  <span style={{ fontSize: "18px" }}>
                                    {icon}
                                  </span>
                                  {fileName}
                                </a>
                              );
                            })()}
                        </div>
                      )}

                      {/* Timeline nếu là tin nhắn đang được chọn */}
                      {shouldShowTimestamp(messages, m, i) && (
                        <div
                          style={{
                            marginTop: "5px",
                            fontSize: "12px",
                            color: "#718096",
                            textAlign:
                              m.sender._id === user._id ? "left" : "right",
                          }}
                        >
                          {new Date(m.createdAt).toLocaleTimeString("vi-VN", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      )}
                    </div>
                    {(isSameSender(messages, m, i, user._id) ||
                      isLastMessage(messages, i, user._id)) && (
                      <div style={{ marginBottom: "-4px" }}>
                        {m.chat.isGroupChat && (
                          <span
                            style={{
                              fontSize: "12px",
                              color: "#4A5568",
                              fontWeight: "bold",
                            }}
                          >
                            {m.sender.fullName}
                          </span>
                        )}
                      </div>
                    )}
                  </VStack>
                </div>
              </HStack>
            </React.Fragment>
          );
        })}
    </ScrollableFeed>
  );
};

export default ScrollableChat;
