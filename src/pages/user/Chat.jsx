import React, { useEffect, useState } from "react";
import "../../assets/css/chat.css";
import Pusher from "pusher-js";
import { toast } from "react-toastify";
import { apiRequest } from "../../utils/api";

import uploadImg from '../../../src/assets/images/upload.png';

const Chat = () => {
  const user_id = localStorage.getItem("user_id")
    ? JSON.parse(localStorage.getItem("user_id"))
    : null;
  const [contacts, setContacts] = useState([]);
  const [messages, setMessages] = useState([]);

  const [loadingMessages, setLoadingMessages] = useState(false);
  const [hasMore, setHasMore] = useState(true); // You already have this?
  const [page, setPage] = useState(1);

  const [selectedFile, setSelectedFile] = useState(null); // file input
  const [previewUrl, setPreviewUrl] = useState(null); // for preview

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentChatUser, setCurrentChatUser] = useState(null); // recipient user
  const token = localStorage.getItem("token");
  const messagesEndRef = React.useRef(null);
  const [freelancerId, setFreelancerId] = useState(0);

  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);    
    if (params.get("user_id")) {
      setFreelancerId(params.get("user_id"));
    } else {
      setFreelancerId(0);
    }
  }, []);
  useEffect(() => {
    fetchContacts(freelancerId);    
  }, [freelancerId]);
  useEffect(() => {
    if (currentChatUser) {
      setPage(1);
      setMessages([]);
      fetchMessages(currentChatUser.id, 1);
    }
  }, [currentChatUser]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    if (!currentChatUser) return;

    Pusher.logToConsole = false;

    const pusher = new Pusher("df1e3f6845822bc38edd", {
      cluster: "ap2",
      forceTLS: true,
    });

    const channel = pusher.subscribe("my-channel");

    channel.bind("my-event", function (data) {
      console.log("Incoming via Pusher:", data);  
      console.log(`From ${data.from}, To ${data.to}, Sender : ${user_id}, Receiver ${currentChatUser?.id}`)          
 
      if (
        (data.from == user_id && data.to == currentChatUser?.id) ||
        (data.from == currentChatUser?.id && data.to == user_id)
      ) {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now(),
            from: data.from,
            to: data.to,
            text: data.message,
            created_at: data.created_at,
            file: data.file,
            userId: data.from,
          },
        ]);
      }
    });

    // fetchMessages(currentChatUser.id);

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [currentChatUser]);

  const fetchContacts = async () => {
    try {

      const response = await apiRequest(
        "GET",
        "/get-chat-users?freelancer_id=" + freelancerId,
        null,
        {
          Authorization: `Bearer ${token}`,
        }
      );
      if (response.data?.status) {
        if (freelancerId) {
          setCurrentChatUser(
            response.data.data.find((user) => user.id == freelancerId)
          );
        } else {
          setContacts(response.data.data.filter((user) => user.id !== user_id)); // exclude self
        }
      } else {
        toast.error("Failed to fetch contacts");
      }
    } catch (error) {
      console.error("Error fetching contacts:", error);
      toast.error("Error fetching contacts");
    }
  };

  const fetchMessages = async (receiverId, page = 1, append = false) => {
    try {
      const response = await apiRequest(
        "GET",
        `/get-message/${receiverId}?page=${page}`,
        null,
        {
          Authorization: `Bearer ${token}`,
        }
      );

      if (response.data?.status && Array.isArray(response.data.data)) {
        const newMessages = response.data.data.map((msg) => ({
          id: Date.now(),
          from: msg.from,
          to: msg.to,
          text: msg.message,
          created_at: msg.created_at,
          file: msg.file,
          userId: msg.from,
        }));

        const filteredMessages = newMessages.filter(
          (msg) =>
            (msg.from == user_id && msg.to == receiverId) ||
            (msg.from == receiverId && msg.to == user_id)
        );

        if (append) {
          setMessages((prev) => [...filteredMessages, ...prev]);
        } else {
          setMessages(filteredMessages);
        }

        // Optional: Stop loading if less than page size returned
        if (filteredMessages.length < 10) {
          setHasMore(false);
        }
      } else {
        toast.error("Failed to fetch messages");
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast.error("Something went wrong while fetching messages");
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || !currentChatUser) return;

    setLoading(true);
    const messageText = input.trim();

    try {
      const payload = new FormData();
      payload.append("message", messageText);
      payload.append("to", currentChatUser.id);
      if (selectedFile) payload.append("file", selectedFile);

      const response = await apiRequest("POST", "/send-message", payload, {
        Authorization: `Bearer ${token}`,
      });

      if (response.data?.status) {
        // Add the sent message to the messages list immediately
        const sentMessage = {
          id: response.data.data?.id || Date.now(),
          from: user_id,
          to: currentChatUser.id,
          text: messageText,
          created_at: response.data.data?.created_at || new Date().toISOString(),
          file: response.data.data?.file || null,
          userId: user_id,
        };
        setMessages((prev) => [...prev, sentMessage]);
        setInput("");
        setSelectedFile(null);
        setPreviewUrl(null);
      } else {
        toast.error("Failed to send message");
      }
    } catch (error) {
      console.error("Send message error:", error);
      toast.error("Something went wrong while sending message");
    } finally {
      setLoading(false);
    }
  };
  const resetCount = async (userId) => {
    try {
      await apiRequest(
        "POST",
        `/update-count`,
        { user_id: userId },
        {
          Authorization: `Bearer ${token}`,
        }
      );
      setContacts((prevContacts) =>
        prevContacts.map((contact) =>
          contact.id === userId ? { ...contact, count: 0 } : contact
        )
      );
    } catch (error) {
      console.error("Error resetting message count:", error);
    }
  };

  const handleScroll = (e) => {
    const scrollTop = e.target.scrollTop;

    if (scrollTop === 0 && hasMore && !loadingMessages) {
      setLoadingMessages(true);

      const nextPage = page + 1;
      fetchMessages(currentChatUser.id, nextPage, true).then(() => {
        setPage(nextPage);
        setLoadingMessages(false);
      });
    }
  };

  const filteredContacts = contacts.filter((contact) =>
    contact.first_name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const isImage = (fileUrl) => {
    return /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(fileUrl);
  };

  return (
    <div className="chat-container">
      {/* Sidebar */}
      {freelancerId < 1 ? (
        <div className="sidebar">
          <h2>
            <input
              type="text"
              className="search-user"
              placeholder="Search user"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </h2>
          <ul>
            {filteredContacts.map((contact) => (
              <li
                key={contact.id}
                onClick={() => {
                  resetCount(contact.id);
                  setCurrentChatUser(contact);
                }}
                className={currentChatUser?.id === contact.id ? "active" : ""}
                style={{display: "flex", gap: "10px"}}
              >
                <span className="image">
                  <img src={contact.image} alt="" />
                </span>
                <div style={{display: "flex", flexDirection: "column"}}>
                <span className="name">{contact.first_name}</span>
                <span className="name">{contact.project_names}</span>
                </div>
                {contact.count > 0 ? (
                  <span className="count">{contact.count}</span>
                ) : (
                  ""
                )}
                <span className="datetime">{contact.created_at}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="chat-window">
        <div className="chat-header">
          <h3>
            {currentChatUser && currentChatUser.project_names ? currentChatUser.project_names : (currentChatUser && currentChatUser.first_name ? currentChatUser.first_name : 'The Code Helper')}
          </h3>
        </div>

        <div className="chat-messages" onScroll={(e) => handleScroll(e)}>
          {messages.map((msg) => (            
            <div
              key={msg.id}
              className={`message ${
                msg.userId === user_id ? "received" : "sent"
              }`}
            >
              {msg.file ? (
                isImage(msg.file) ? (
                  <div>
                    <img
                      src={msg.file}
                      alt="uploaded"
                      style={{
                        width: "150px",
                        height: "auto",
                        borderRadius: "8px",
                        marginTop: "10px",
                      }}
                    />
                    <br />
                  </div>
                ) : (
                  <div style={{ marginTop: "10px" }}>
                    <img
                      src="/src/assets/images/file.png" // use a proper doc icon image
                      alt="document"
                      style={{
                        width: "40px",
                        verticalAlign: "middle",
                        cursor: "pointer",
                      }}
                      onClick={() => window.open(msg.file, "_blank")}
                    />
                    <a
                      href={msg.file}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ marginLeft: "10px" }}
                    >
                      View Document
                    </a>
                  </div>
                )
              ) : null}

              <span>{msg.text}</span><br/>
              <span>{msg.created_at}</span>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {currentChatUser && (
          <div className="chat-input">
            {selectedFile && (
              <div className="preview-area">
                {previewUrl ? (
                  <img src={previewUrl} width="150" />
                ) : (
                  <p>{selectedFile.name}</p>
                )}
                <button
                  onClick={() => {
                    setSelectedFile(null);
                    setPreviewUrl(null);
                  }}
                >
                  ❌
                </button>
              </div>
            )}
            <div className="chat-input-wrapper">
              <label htmlFor="file" className="upload-file">
              <img src={uploadImg} alt="" />
                <input
                  type="file"
                  name="file"
                  id="file"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    setSelectedFile(file);
                    if (file && file.type.startsWith("image/")) {
                      setPreviewUrl(URL.createObjectURL(file));
                    } else {
                      setPreviewUrl(null);
                    }
                  }}
                />
              </label>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Type your message..."
              />
              <button onClick={sendMessage}>Send</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
