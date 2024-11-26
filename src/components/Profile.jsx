import React, { useContext, useEffect, useState } from "react";
import { context } from "../Context/Global";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/Firebase";

function Profile() {
  const { user } = useContext(context);
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch user's friends from Firestore
  useEffect(() => {
    const fetchFriends = async () => {
      try {
        if (!user?.uid) return;
        const userDoc = await getDoc(doc(db, "users", user.uid));
        setFriends(userDoc.data()?.friends || []);
      } catch (err) {
        console.error("Error fetching friends:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFriends();
  }, [user]);

  return (
    <div className="bg-gray-100 min-h-screen flex justify-center items-center">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
        {/* User Profile Info */}
        <div className="text-center mb-6">
          <img
            src={"https://images.unsplash.com/photo-1732461048142-c320071e0f57?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxMnx8fGVufDB8fHx8fA%3D%3D" || "https://via.placeholder.com/150"}
            alt="Profile"
            className="w-24 h-24 rounded-full mx-auto mb-4"
          />
          <h2 className="text-lg font-semibold text-gray-700">{user?.name || "User Name"}</h2>
          <p className="text-gray-600">{user?.email || "User Email"}</p>
        </div>

        {/* Friends Section */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Friends</h3>
          {loading ? (
            <p className="text-center text-gray-500">Loading friends...</p>
          ) : friends.length > 0 ? (
            <ul className="space-y-2">
              {friends.map((friend) => (
                <li
                  key={friend.id}
                  className="flex items-center gap-3 bg-gray-100 hover:bg-gray-200 rounded-lg p-3 shadow-sm"
                >
                  <img
                    src={friend.photoURL || "https://images.unsplash.com/photo-1732461048142-c320071e0f57?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxMnx8fGVufDB8fHx8fA%3D%3D"}
                    alt={friend.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <span className="text-gray-700 font-medium">{friend.name}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No friends to display</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;
