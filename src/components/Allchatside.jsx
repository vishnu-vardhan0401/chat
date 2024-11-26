import React, { useContext, useEffect, useState } from "react";
import { IoIosAirplane } from "react-icons/io";
import { context } from "../Context/Global";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/Firebase";

function Allchats() {
  const [friends, setFriends] = useState([]); // State for friends
  const [recentChats, setRecentChats] = useState({}); // State for storing recent chats
  const [loading, setLoading] = useState(true); // Loading state
  const { user, setonlivefriend } = useContext(context);

  // Fetch the user's friends from Firestore
  const getFriends = async () => {
    try {
      if (!user?.uid) {
        console.error("User not logged in or UID missing");
        return;
      }

      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        const friendsList = userDoc.data()?.friends || [];
        setFriends(friendsList);
      } else {
        console.log("User document does not exist");
      }
    } catch (error) {
      console.error("Error fetching friends:", error);
    } finally {
      setLoading(false); // End loading state
    }
  };

  // Fetch the last message between the user and each friend
  const getLastChatMessage = async (friendId) => {
    try {
      const userDoc = await getDoc(doc(db, "users", user.uid));

      if (userDoc.exists()) {
        const chats = userDoc.data()?.chats || [];
        // Filter messages that involve the current friend
        const friendChats = chats.filter(
          (chat) => chat.to === friendId || chat.from === friendId
        );

        // Sort by timestamp and get the most recent one
        if (friendChats.length > 0) {
          friendChats.sort((a, b) => b.timestamp - a.timestamp);
          return friendChats[0]; // Return the latest chat
        }
      }
    } catch (error) {
      console.error("Error fetching last chat message:", error);
    }
    return null; // Return null if no messages found
  };

  // Fetch all recent chats when friends change
  const fetchRecentChats = async () => {
    try {
      const recentChatsData = {};
      for (let friend of friends) {
        const lastMessage = await getLastChatMessage(friend.id);
        recentChatsData[friend.id] = lastMessage ? lastMessage.text : "No messages yet";
      }
      setRecentChats(recentChatsData);
    } catch (error) {
      console.error("Error fetching recent chats:", error);
    }
  };

  useEffect(() => {
    getFriends();
  }, [user,setRecentChats]);

  useEffect(() => {
    if (friends.length > 0) {
      fetchRecentChats(); // Fetch the recent chats once friends are loaded
    }
  }, [friends]);

  if (loading) {
    return <div>Loading chats...</div>;
  }

  const renderChats = (id, name) => {
    setonlivefriend({
      id: id,
      name: name,
    });
  };

  return (
    <div className="bg-white w-72 h-full p-4 shadow-md rounded-lg overflow-y-auto">
      <h1 className="text-xl font-bold mb-4 text-gray-700">Chats</h1>
      {friends.length > 0 ? (
        friends.map((friend) => (
          <div
            onClick={() => renderChats(friend.id, friend.name)}
            key={friend.id}
            className="flex flex-col gap-2 bg-purple-100 hover:bg-purple-200 transition mt-3 rounded-lg p-3 shadow-sm cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <IoIosAirplane className="text-3xl text-purple-600" />
              <h1 className="text-lg font-bold text-gray-800">{friend.name}</h1>
            </div>
            <p className="text-sm text-gray-600">
              {recentChats[friend.id] || "No messages yet"}
            </p>
          </div>
        ))
      ) : (
        <p className="text-gray-500">No friends to show</p>
      )}
    </div>
  );
}

export default Allchats;
