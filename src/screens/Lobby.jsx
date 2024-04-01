import React, { useState, useCallback, useEffect } from "react";
import AgeVerificationModal from "../components/AgeVerificationModal";
import textChat from "../images/text-chat.jpg";
import videoChat from "../images/video-chat.png";
import "../styling/lobby.css";

import { useNavigate } from "react-router-dom";
import { useSocket } from "../context/SocketProvider";

const LobbyScreen = () => {
  // const [email, setEmail] = useState("");
  // const [room, setRoom] = useState("");
  const [interest, setInterest] = useState("");
  const [area, setArea] = useState("");

  const socket = useSocket();
  const navigate = useNavigate();

  const handleVideoChatClick = useCallback(
    (e) => {
      e.preventDefault();
      socket.emit("room:join", { interest, area, type:"Video" });
    },
    [interest, area, socket]
  );

  const handleTextChatClick = useCallback(
    (e) => {
      e.preventDefault();
      socket.emit("room:join", { interest, area , type:"Text"});
    },
    [interest, area, socket]
  );

  const handleJoinRoom = useCallback(
    (data) => {
      const { type, roomName } = data;
      console.log("chat Type:",type)
      if(type=="Text"){
        navigate(`/room/text/${roomName}`);
      }else{
        navigate(`/room/video/${roomName}`);
      }
    },
    [navigate]
  );


  useEffect(() => {
    socket.on("room:join", handleJoinRoom);
    return () => {
      socket.off("room:join", handleJoinRoom);
    };
  }, [socket, handleJoinRoom]);

  return (
    <div>
      <div>
          <div className="homepage">
            <h1>Welcome to Randomly</h1>
            <div>
              <label htmlFor="email">Interest (optional) </label>
              <input
                type="text"
                id="interest"
                value={interest}
                onChange={(e) => setInterest(e.target.value)}
              />
              <br />
              <label htmlFor="Area">Area ( optional ) </label>
              <input
                type="text"
                id="Area"
                value={area}
                onChange={(e) => setArea(e.target.value)}
              />
              <br />
              <br />
              <br />
            </div>
            <div className="button-container">
              <button className="text-chat-button" onClick={handleTextChatClick} >
                <img
                  src={textChat}
                  alt="Text Chat"
                  height="80px"
                  width="120px"
                />
                <p className="btntext">Text  <br /> Chat </p> 
              </button>
              <button className="video-chat-button" onClick={handleVideoChatClick} >
                <img
                  src={videoChat}
                  alt="Video Chat"
                  height="80px"
                  width="120px"
                />
                <p className="btntext" >Video <br /> Chat </p> 
              </button>
            </div>
          </div>
      </div>
      <AgeVerificationModal />
    </div>
  );
};

export default LobbyScreen;
