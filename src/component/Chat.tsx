import { useEffect, useState, useRef} from "react";
import { jwtDecode } from "jwt-decode";
import { useLocation } from "react-router-dom";
import axios from "axios";





interface Message {
  senderId: string;
  content: string;
}

  const Chat = () => {
  const location = useLocation();
  const { receiverId ,receiverName} = location.state || {}
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");

  const token : any= localStorage.getItem("authToken")
  const decodedToken = jwtDecode<{ userId: string }>(token);
  const userId :any = decodedToken.userId;
  
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (receiverId && userId) {
      axios
        .get(`http://localhost:3000/getmessages/chat?userId=${userId}&receiverId=${receiverId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          setMessages(response.data.messages);
        })
        .catch((error) => {
          console.error("Failed to fetch chat history:", error);
        });
    }
  }, [receiverId, userId, token]);

  useEffect(() => {
    if (!receiverId || receiverId === userId) return;

    const socket = new WebSocket("ws://localhost:3000");
    socketRef.current = socket;

    socket.onopen = () => {
      socket.send(
        JSON.stringify({ type: "auth", token })
      );
    };

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === "message") {
        setMessages((prevMessages) => [...prevMessages, message]);
      } else if (message.status === "sent") {
        console.log("Message sent successfully:", message.message);
      } else if (message.error) {
        console.error("WebSocket error message:", message.error);
      }
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    socket.onclose = () => {
      console.log("WebSocket connection closed.");
    };

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, [receiverId, token, userId]);

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <header className="bg-green-600 text-white p-4 text-center font-bold">
        Chat with {receiverName}
      </header>

      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.senderId === userId? "justify-end" : "justify-start"
            } mb-2`}
          >
            <div
              className={`rounded-lg p-3 ${
                message.senderId === userId
                  ? "bg-green-500 text-white"
                  : "bg-gray-300 text-black"
              } max-w-xs`}
            >
              {message.content}
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 bg-white border-t">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message"
            className="flex-1 border rounded-full px-4 py-2"
          />
          <button
            onClick={handleSendMessage}
            className="bg-green-900 text-white px-4 py-2 rounded-full hover:bg-green-600"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );

  function handleSendMessage() {
    
    if (newMessage.trim() && socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      const message = {
        type: "message",
        senderId: userId,
        receiverId,
        content: newMessage,
      };
      socketRef.current.send(JSON.stringify(message));
      setMessages((prevMessages) => [...prevMessages, message]);
      setNewMessage("");
    }
  }
};

export default Chat;
