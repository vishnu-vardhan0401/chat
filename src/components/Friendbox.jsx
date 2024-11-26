import { arrayUnion, doc, getDoc, updateDoc } from "firebase/firestore";
import React, { useContext, useState, useEffect } from "react";
import { db } from "../firebase/Firebase";
import { context } from "../Context/Global";

function Friendbox({ id, name }) {
  const { user } = useContext(context);
  const [isSent, setIsSent] = useState(false); // Track if the request is sent
  const [loading, setLoading] = useState(false); // Track loading state

  if (!user || !user.uid) {
    console.error("User is not logged in or UID is missing");
    return null; // Render nothing if user is not available
  }

  // Check if the friend request has been sent when the component is mounted
  useEffect(() => {
    const checkFriendRequestStatus = async () => {
      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          const friendRequests = userData.friendRequests || [];
          setIsSent(friendRequests.some((request) => request.id === id));
        }
      } catch (error) {
        console.error("Error fetching user document:", error);
      }
    };

    checkFriendRequestStatus();
  }, [user, id]);

  // Add friend function
  async function Addfriend(friendId, friendName) {
    setLoading(true); // Set loading state
    try {
      // Update the friend's document in Firestore
      await updateDoc(doc(db, "users", friendId), {
        friendRequests: arrayUnion({ id: user.uid }),
      });

      // Optionally, track outgoing requests for the current user
      await updateDoc(doc(db, "users", user.uid), {
        sentRequests: arrayUnion({ id: friendId }),
      });

      setIsSent(true); // Mark as sent
      alert(`Friend request sent to ${friendName}`);
    } catch (error) {
      console.error("Error sending friend request:", error);
      alert("Failed to send friend request. Please try again.");
    } finally {
      setLoading(false); // Reset loading state
    }
  }

  return (
    <div className="w-60 border-2 border-gray-400 flex justify-around p-0.5">
      <h1 className="p-1">{name}</h1>
      <button
        className={`text-white p-1 rounded-md ${
          isSent || loading ? "bg-gray-400 cursor-not-allowed" : "bg-rose-400"
        }`}
        onClick={() => Addfriend(id, name)}
        disabled={isSent || loading} // Disable during processing or if already sent
      >
        {loading ? "Sending..." : isSent ? "Sent" : "Add Friend"}
      </button>
    </div>
  );
}

export default Friendbox;
