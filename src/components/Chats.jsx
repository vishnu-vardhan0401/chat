import React, { useContext, useEffect, useRef, useState } from "react";
import { IoMdAttach, IoMdMale, IoMdSend } from "react-icons/io";
import { context } from "../Context/Global";
import { doc, getDoc, updateDoc, arrayUnion, Timestamp } from "firebase/firestore";
import { db } from "../firebase/Firebase";

function Chats() {
  const chatEndRef = useRef(null);
  const [text1, setText1] = useState(""); // Message input
  const [error, setError] = useState(""); // Input error
  const { user, onlivefriend, chat, setchat } = useContext(context); // Context values

  // Scroll to the bottom when chat updates
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  // Fetch and filter chats
  useEffect(() => {
    const fetchChats = async () => {
      if (!user?.uid || !onlivefriend?.id) {
        setchat([]); // Clear chat state
        return;
      }

      try {
        const userDocRef = doc(db, "users", user.uid); // Current user's document
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const allChats = userDoc.data().chats || []; // Retrieve all chats

          // Filter chats between the current user and the selected friend
          const filteredChats = allChats.filter(
            (message) =>
              (message.from === user.uid && message.to === onlivefriend.id) ||
              (message.from === onlivefriend.id && message.to === user.uid)
          );

          setchat(filteredChats); // Update chat state
        } else {
          setchat([]); // Clear chat if no data
        }
      } catch (error) {
        console.error("Error fetching chats:", error);
        setchat([]); // Clear chat state on error
      }
    };

    fetchChats();
  }, [user, onlivefriend]); // Fetch chats when user or online friend changes

  // Send a message
  async function sendmessage() {
    if (!text1.trim()) {
      setError("Message cannot be empty!");
      return;
    }

    const newMessage = {
      id: Date.now(), // Unique ID
      text: text1,
      timestamp: Timestamp.now(), // Current timestamp
      from: user.uid, // Sender ID
      to: onlivefriend.id, // Receiver ID
    };

    try {
      const userDocRef = doc(db, "users", user.uid); // Sender's document
      await updateDoc(userDocRef, {
        chats: arrayUnion(newMessage), // Add message to sender's chat
      });

      const friendDocRef = doc(db, "users", onlivefriend.id); // Receiver's document
      await updateDoc(friendDocRef, {
        chats: arrayUnion(newMessage), // Add message to receiver's chat
      });

      setchat((prevChat) => [...prevChat, newMessage]); // Update local state
      setText1(""); // Clear input field
      setError(""); // Clear error
    } catch (error) {
      console.error("Error sending message:", error);
    }
  }

  return (
    <div className="flex flex-col sm-max:w-full gap-3 w-[70%] justify-between h-screen bg-white shadow-lg rounded-lg">
      {/* Chat Header */}
      <div className="chat-header p-5 border-b">
        <h1 className="text-3xl font-bold text-gray-800">{onlivefriend?.name || "Chat"}</h1>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 p-4 overflow-y-auto">
        {chat.length > 0 ? (
          chat.map((message) => (
            <div
              key={message.id}
              className={`flex gap-2 mb-3 items-end ${
                message.from === user.uid ? "justify-end" : ""
              }`}
            >
              {message.from !== user.uid && (
                <IoMdMale className="text-2xl text-gray-500" />
              )}
              <p
                className={`p-2 rounded-md text-gray-700 max-w-xs ${
                  message.from === user.uid
                    ? "bg-purple-300"
                    : "bg-purple-100"
                }`}
              >
                {message.text}
              </p>
              {message.from === user.uid && (
                <IoMdMale className="text-2xl text-gray-500" />
              )}
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center">No messages yet.</p>
        )}
        <div ref={chatEndRef}></div>
      </div>

      {/* Chat Input */}
      <div className="flex flex-col bg-gray-200 p-3 mb-10 rounded-lg mx-2">
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <div className="flex items-center gap-3">
          <IoMdAttach className="text-2xl text-gray-500 cursor-pointer" />
          <input
            value={text1}
            onChange={(e) => setText1(e.target.value)}
            className="flex-1 bg-gray-200 outline-none text-gray-700"
            placeholder="Type your message here..."
            type="text"
          />
          <IoMdSend
            onClick={sendmessage}
            className="text-2xl text-purple-600 cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
}

export default Chats;