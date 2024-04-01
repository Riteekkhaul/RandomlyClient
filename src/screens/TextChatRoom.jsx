import React, { useEffect, useCallback, useState } from "react";
import ReactPlayer from "react-player";
import peer from "../service/peer";
import { useSocket } from "../context/SocketProvider";
import axios from "axios";
import "../App.css";

const RoomPage = () => {
  const socket = useSocket();
  const [remoteSocketId, setRemoteSocketId] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [query, setQuery] = useState("");
  const [gifList, setGifList] = useState([]);

  useEffect(() => {
    // Listen for incoming messages
    socket.on("message", (message) => {
      setMessages([...messages, message]);
    });

    return () => {
      socket.off("message");
    };
  }, [messages]);

  const handleSendMessage = () => {
    socket.emit("sendMessage", { text: message });
    setMessage("");
  };

  const handleUserJoined = useCallback((data) => {
    const { id } = data;
    setRemoteSocketId(id);
  }, []);

  const searchGifs = async () => {
    const options = {
      method: "GET",
      url: "https://api.giphy.com/v1/gifs/search",
      params: {
        q: query,
        limit: 20,
        api_key: process.env.REACT_APP_API_KEY,
      },
    };

    try {
      const response = await axios.request(options);
      console.log(response.data.data);
      setGifList(response.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    socket.on("user:joined", handleUserJoined);

    return () => {
      socket.off("user:joined", handleUserJoined);
    };
  }, [socket, handleUserJoined]);

  return (
    <div className="container">
      <div className="left">
        <div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button onClick={searchGifs}>Search</button>
          <div className="gif">
            {gifList.map((gif, index) => (
              <div className="gif__image-container" key={index}>
                <img
                  className="gif__image"
                  src={gif.images.fixed_height.url}
                  alt="gif"
                  height="60px"
                  width="60px"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="right">
        <div className="chat-container">
          <div className="chat-messages">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`message ${
                  message.user === remoteSocketId ? "received" : "sent" //{message.user}
                }`}
              >
                <p className="message-text">
                  <b>
                    {remoteSocketId === message.user ? "Stranger : " : "You : "}
                  </b>
                  {message.text}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="input-container">
          <button className="skip-button"> Skip </button>
          <input
            type="text"
            className="input-text"
            placeholder="Type your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button className="gifbtn">GIF</button>
          <button className="send-button" onClick={handleSendMessage}>
            {" "}
            Send{" "}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoomPage;
