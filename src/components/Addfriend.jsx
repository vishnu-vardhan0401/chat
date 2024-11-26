import React, { useContext, useEffect, useState } from "react";
import { collection, getDocs, doc, updateDoc, arrayUnion, getDoc } from "firebase/firestore";
import { db } from "../firebase/Firebase";
import { context } from "../Context/Global";

function AddFriend() {
  const [friend, setFriend] = useState(""); // For search input
  const [friendList, setFriendList] = useState([]); // All potential friends
  const [filteredFriends, setFilteredFriends] = useState([]); // Filtered friends for display
  const [sentRequests, setSentRequests] = useState([]); // Friend requests sent by the user
  const [friends, setFriends] = useState([]); // Current user's friends
  const { user } = useContext(context);

  // Fetch all users, current user's friends, and sent requests from Firestore
  async function fetchUsers() {
    try {
      const querySnap = await getDocs(collection(db, "users"));
      const data = querySnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
  
      // Fetch current user's friends and friend requests
      const currentUserDoc = await getDoc(doc(db, "users", user.uid));
      const currentUserData = currentUserDoc.exists() ? currentUserDoc.data() : {};
      const friends = currentUserData.friends || []; // Ensure it's an array
      const sentRequests = currentUserData.sentRequests || []; // Users with pending requests
  
      // Filter out the current user, their friends, and pending requests
      const nonFriends = data.filter(
        (doc) =>
          doc.email !== user.email &&
          !friends.some((friend) => friend.id === doc.id) &&
          !sentRequests.includes(doc.id) // Exclude users with pending requests
      );
  
      setFriendList(nonFriends);
      setFilteredFriends(nonFriends); // Initialize the filtered list
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  }
  

  // Search/filter functionality
  useEffect(() => {
    const results = friendList.filter((user) =>
      user.name.toLowerCase().includes(friend.toLowerCase())
    );
    setFilteredFriends(results);
  }, [friend, friendList]);

  // Send friend request
  const handleAddFriend = async (friendId) => {
    try {
      const friendDocRef = doc(db, "users", friendId);
      const currentUserData = await getDoc(doc(db, "users", user.uid));
      await updateDoc(friendDocRef, {
        friendRequests: arrayUnion({ id: user.uid, name: currentUserData.data().name }),
      });
      await updateDoc(doc(db, "users", user.uid), {
        sentRequests: arrayUnion(friendId),
      });
      setSentRequests((prev) => [...prev, friendId]); // Update local state
      alert("Friend request sent!");
    } catch (error) {
      console.error("Error sending friend request:", error);
    }
  };

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="bg-white h-screen p-6">
      {/* Header Section */}
      <div className="flex flex-col items-center gap-4">
        <h1 className="text-3xl font-bold text-gray-800">Add Friend</h1>
        <input
          className="w-full max-w-md border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:border-blue-500 transition"
          type="text"
          name="friendname"
          value={friend}
          onChange={(e) => setFriend(e.target.value)}
          placeholder="Search friend"
        />
      </div>

      {/* Friends List */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredFriends.length > 0 ? (
          filteredFriends.map((user) => (
            <div
              key={user.id}
              className="flex items-center p-4 bg-gray-100 rounded-lg shadow-md hover:shadow-lg transition"
            >
              {/* Profile Picture */}
              <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-gray-300">
                <img
                  src={"https://images.unsplash.com/photo-1732461048142-c320071e0f57?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxMnx8fGVufDB8fHx8fA%3D%3D" || "https://via.placeholder.com/150"}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* User Info */}
              <div className="ml-4">
                <h2 className="text-lg font-semibold text-gray-800">
                  {user.name}
                </h2>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
              {/* Add Friend Button */}
              {friends.includes(user.id) ? (
                <button
                  className="ml-auto bg-green-500 text-white px-4 py-2 rounded-lg cursor-not-allowed"
                  disabled
                >
                  Friend
                </button>
              ) : sentRequests.includes(user.id) ? (
                <button
                  className="ml-auto bg-gray-400 text-white px-4 py-2 rounded-lg cursor-not-allowed"
                  disabled
                >
                  Sent
                </button>
              ) : (
                <button
                  onClick={() => handleAddFriend(user.id)}
                  className="ml-auto bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                >
                  Add
                </button>
              )}
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center col-span-full">
            No friends found.
          </p>
        )}
      </div>
    </div>
  );
}

export default AddFriend;
