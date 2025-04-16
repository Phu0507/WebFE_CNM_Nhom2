import axios from "axios";
import React, { useEffect } from "react";
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
import socket from "../../context/socket";

const ScrollableChat = ({
  messages,
  recallMessage,
  deleteMessageForMe,
  setMessages,
}) => {
  const { user } = ChatState();
  const id = useId();
  const [selectedMsgId, setSelectedMsgId] = useState(null);
  const [hoveredMsgId, setHoveredMsgId] = useState(null);
  const [editingMessage, setEditingMessage] = useState(null);
  const [newContent, setNewContent] = useState("");

  // const socket = io("http://localhost:5000", {
  //   transports: ["websocket"],
  // });

  const handleEditMessage = (message) => {
    setEditingMessage(message);
    setNewContent(message.content);
  };

  const handleSaveEditedMessage = async () => {
    if (newContent.trim() === "") return; // Kiểm tra nếu nội dung trống

    try {
      // Gọi API PUT để lưu tin nhắn chỉnh sửa
      const response = await axios.put(
        `http://localhost:5000/api/message/edit/${editingMessage._id}`, // Đường dẫn API chỉnh sửa tin nhắn
        { content: newContent }, // Gửi nội dung mới
        { headers: { Authorization: `Bearer ${user.token}` } } // Đảm bảo rằng token được truyền vào header
      );
      console.log("Response from API:", response);

      if (response.status === 200) {
        // Sau khi lưu thành công, cập nhật tin nhắn trong state
        const updatedMessages = messages.map((message) =>
          message._id === editingMessage._id
            ? { ...message, content: newContent } // Cập nhật nội dung tin nhắn
            : message
        );

        setMessages(updatedMessages); // Cập nhật lại danh sách tin nhắn
        socket.emit("messageEdited", response.data);
        // Reset form chỉnh sửa
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
                    left:
                      m.sender._id === user._id ? "-160px" : "calc(100% + 4px)",
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
                    </>
                  )}
                </div>
              )}

              <div
                onClick={() =>
                  setSelectedMsgId(selectedMsgId === m._id ? null : m._id)
                }
                style={{
                  backgroundColor:
                    m.sender._id === user._id ? "#BEE3F8" : "white",
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
                        <textarea
                          value={newContent}
                          onChange={(e) => setNewContent(e.target.value)}
                          style={{
                            width: "100%",
                            padding: "8px",
                            borderRadius: "8px",
                            border: "1px solid #ccc",
                            fontSize: "14px",
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
                        <span>{m.content}</span>
                        {m.isEdited && (
                          <span
                            style={{
                              fontSize: "11px",
                              color: "#718096",
                              marginLeft: "6px",
                            }}
                          >
                            (đã chỉnh sửa)
                          </span>
                        )}
                      </>
                    )}

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
      {/* Hiển thị form chỉnh sửa tin nhắn
      {editingMessage && (
        <div style={{ marginTop: "10px" }}>
          <textarea
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            style={{
              width: "100%",
              height: "60px",
              padding: "10px",
              borderRadius: "10px",
              border: "1px solid #ccc",
              fontSize: "14px",
            }}
          />
          <div style={{ marginTop: "5px", textAlign: "right" }}>
            <button
              onClick={handleSaveEditedMessage}
              style={{
                backgroundColor: "#3182CE",
                color: "white",
                padding: "8px 12px",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Lưu
            </button>
            <button
              onClick={() => setEditingMessage(null)}
              style={{
                marginLeft: "10px",
                backgroundColor: "#f56565",
                color: "white",
                padding: "8px 12px",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Hủy
            </button>
          </div>
        </div>
      )} */}
    </ScrollableFeed>
  );
};

export default ScrollableChat;
