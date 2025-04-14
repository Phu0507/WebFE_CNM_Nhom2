import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import Peer from "simple-peer";
import styled from "styled-components";
import { useParams, useNavigate } from "react-router-dom"; // Đã bỏ useLocation vì không dùng

// Styled components
const Container = styled.div`
  padding: 20px;
  display: flex;
  height: 100vh;
  width: 90%;
  margin: auto;
  flex-wrap: wrap;
`;

const StyledVideo = styled.video`
  height: 40%;
  width: 50%;
`;

const EndCallButton = styled.button`
  position: fixed;
  bottom: 30px;
  right: 40px;
  background-color: red;
  color: white;
  padding: 12px 20px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  z-index: 999;
  &:hover {
    background-color: darkred;
  }
`;

// Video component
const Video = ({ peer }) => {
  const ref = useRef();

  useEffect(() => {
    peer.on("stream", (stream) => {
      ref.current.srcObject = stream;
    });
  }, [peer]);

  return <StyledVideo playsInline autoPlay ref={ref} />;
};

const videoConstraints = {
  height: window.innerHeight / 2,
  width: window.innerWidth / 2,
};

const CallRoom = () => {
  const { roomID } = useParams();
  const navigate = useNavigate();

  const [peers, setPeers] = useState([]);
  const socketRef = useRef();
  const userVideo = useRef();
  const peersRef = useRef([]);

  useEffect(() => {
    socketRef.current = io.connect("/");

    navigator.mediaDevices
      .getUserMedia({ video: videoConstraints, audio: true })
      .then((stream) => {
        userVideo.current.srcObject = stream;

        socketRef.current.emit("join room", roomID);

        socketRef.current.on("all users", (users) => {
          const peers = [];
          users.forEach((userID) => {
            const peer = createPeer(userID, socketRef.current.id, stream);
            peersRef.current.push({
              peerID: userID,
              peer,
            });
            peers.push(peer);
          });
          setPeers(peers);
        });

        socketRef.current.on("user joined", (payload) => {
          const peer = addPeer(payload.signal, payload.callerID, stream);
          peersRef.current.push({
            peerID: payload.callerID,
            peer,
          });

          setPeers((users) => [...users, peer]);
        });

        socketRef.current.on("receiving returned signal", (payload) => {
          const item = peersRef.current.find((p) => p.peerID === payload.id);
          item?.peer.signal(payload.signal);
        });
      })
      .catch((error) => {
        console.error("Error accessing media devices.", error);
      });

    // return () => {
    //   handleDisconnect(); // cleanup khi component unmount
    // };
  }, [roomID]);

  const createPeer = (userToSignal, callerID, stream) => {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream,
    });

    peer.on("signal", (signal) => {
      socketRef.current.emit("sending signal", {
        userToSignal,
        callerID,
        signal,
      });
    });

    return peer;
  };

  const addPeer = (incomingSignal, callerID, stream) => {
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream,
    });

    peer.on("signal", (signal) => {
      socketRef.current.emit("returning signal", { signal, callerID });
    });

    peer.signal(incomingSignal);
    return peer;
  };

  const handleDisconnect = () => {
    const confirmLeave = window.confirm("Bạn có chắc muốn kết thúc cuộc gọi?");
    if (!confirmLeave) return;

    // Ngắt kết nối peer của chính người gọi (người đang thực hiện ngắt kết nối)
    if (peersRef.current && peersRef.current.length > 0) {
      peersRef.current.forEach(({ peer, peerID }) => {
        try {
          // Chỉ hủy kết nối peer của người gọi (chính người đang rời cuộc gọi)
          if (peerID === socketRef.current.id) {
            peer?.destroy?.(); // Ngắt kết nối peer của người gọi
          }
        } catch (err) {
          console.error("Lỗi khi hủy peer:", err);
        }
      });
    }

    // Tắt tất cả track video/audio của người gọi
    if (userVideo.current?.srcObject) {
      userVideo.current.srcObject.getTracks().forEach((track) => {
        try {
          track.stop(); // Dừng track của người gọi
        } catch (err) {
          console.error("Lỗi khi dừng track:", err);
        }
      });
    }

    // Ngắt socket của người gọi nếu tồn tại
    if (socketRef.current?.disconnect) {
      try {
        socketRef.current.disconnect(); // Ngắt kết nối socket
      } catch (err) {
        console.error("Lỗi khi ngắt socket:", err);
      }
    }

    // Điều hướng về trang trước
    try {
      navigate(-1); // Quay về trang trước
    } catch (err) {
      console.error("Lỗi khi điều hướng:", err);
    }
  };

  return (
    <Container>
      <StyledVideo muted ref={userVideo} autoPlay playsInline />
      {peers.map((peer, index) => (
        <Video key={index} peer={peer} />
      ))}
      <EndCallButton onClick={handleDisconnect}>
        Kết thúc cuộc gọi
      </EndCallButton>
    </Container>
  );
};

export default CallRoom;
