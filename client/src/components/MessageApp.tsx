import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BiSend } from "react-icons/bi";
import io, { Socket } from "socket.io-client";

// Define types for message and socket connection
interface MessageData {
  senderId: string;
  message: string;
}

let socket: Socket;

const MessageApp = () => {
  const [message, setMessage] = useState<string>("");
  const [receivedMessage, setReceivedMessage] = useState<MessageData[]>([]);

  useEffect(() => {
    // Initialize socket connection
    socket = io("http://localhost:4000");

    // Socket connection established
    socket.on("connect", () => {
      console.log("Connected to server");
    });

    // Listen for incoming chat messages
    socket.on("chat_show", (data: MessageData) => {
      console.log("Message received:", data);
      setReceivedMessage((prevMessages) => [...prevMessages, data]);
    });

    // Cleanup on component unmount
    return () => {
      socket.disconnect();
    };
  }, []);

  const handleSend = () => {
    if (message.trim() === "") {
      toast.error("Message cannot be empty", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    // Emit the message to the server along with the sender's Socket ID
    socket.emit("chat", message);
    console.log("Message sent:", message);

    setMessage(""); // Clear the input field
  };

  return (
    <div className="relative min-h-screen">
      <h1 className="text-3xl text-blue-400 text-center my-4">
        Free Message App
      </h1>

      {/* Chat Messages */}
      <div className="space-y-4 p-4">
        {receivedMessage.map((msg, index) => (
          <div
            key={index}
            className={`chat ${msg.senderId === socket.id ? "chat-end" : "chat-start"}`}
          >
            <div className="chat-image avatar">
              <div className="w-10 rounded-full">
                <img
                  alt="Avatar"
                  src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                />
              </div>
            </div>
            <div className="chat-header">
              {msg.senderId === socket.id ? "You" : "User"}
              <time className="text-xs p-1 opacity-50">{new Date().toLocaleTimeString()}</time>
            </div>
            <div
              className={`chat-bubble ${msg.senderId === socket.id ? "chat-bubble-primary" : "chat-bubble-secondary"
                }`}
            >
              {msg.message}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="fixed bottom-0 flex justify-center left-0 w-full shadow-md p-4">
        <div className="flex flex-col items-center">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message here"
              className="input input-bordered input-primary w-full max-w-xs"
            />
            <button
              onClick={handleSend}
              className="btn btn-primary flex items-center space-x-1"
            >
              <span>Send</span>
              <BiSend className="h-5 w-5" />
            </button>
          </div>
          <ToastContainer />
        </div>
      </div>
    </div>
  );
};

export default MessageApp;
