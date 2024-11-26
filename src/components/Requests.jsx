import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { context } from "../Context/Global";
import { db } from "../firebase/Firebase";
import { IoMdCheckmarkCircle, IoMdCloseCircle } from "react-icons/io";

function Requests() {
  const { user } = useContext(context);
  const [requests, setRequests] = useState([]);
  const [details, setDetails] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      if (!user?.uid) {
        console.error("User not logged in or UID missing");
        return;
      }
  
      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (!userDoc.exists()) {
          console.error("User document does not exist");
          return;
        }
  
        const friendRequests = userDoc.data().friendRequests || [];
        
        setRequests(friendRequests);
  
        if (friendRequests.length > 0) {
          const userDetails = await Promise.all(
            friendRequests.map(async (item) => {
              const friendDoc = await getDoc(doc(db, "users", item.id));
              if (friendDoc.exists()) {
              
                return {
                  name: friendDoc.data().name || "Unknown",
                  id: item.id,
                  profilePic: friendDoc.data().profilePic || "",
                };
              } else {
                console.warn("Friend document does not exist for ID:", item.id);
                return null;
              }
            })
          );
          setDetails(userDetails.filter((detail) => detail !== null));
        } else {
          console.log("No friend requests found");
        }
      } catch (error) {
        console.error("Error fetching friend requests:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchRequests();
  }, [user]);
  

  const acceptFriendRequest = async (id, name) => {
    try {
      const userDocRef = doc(db, "users", user.uid); // Current user's doc
      const friendDocRef = doc(db, "users", id); // Friend's doc
  
      // Add to both users' `friends` lists
      await updateDoc(userDocRef, {
        friends: arrayUnion({ id, name }), // Add friend to current user's `friends`
      });
  
      // Fetch current user's name for the friend's `friends` list
      const userDoc = await getDoc(userDocRef);
      const currentUserName = userDoc.data().name || "Unknown";
  
      await updateDoc(friendDocRef, {
        friends: arrayUnion({ id: user.uid, name: currentUserName }), // Add current user to friend's `friends`
      });
  
      // Remove from current user's `friendRequests`
      await updateDoc(userDocRef, {
        friendRequests: arrayRemove({ id, name }), // Remove the request from current user's friendRequests
      });
  
      // Remove from friend's `sentRequests`
      await updateDoc(friendDocRef, {
        sentRequests: arrayRemove(user.uid), // Remove current user's ID from the friend's sentRequests
      });
  
      // Update UI
      setRequests((prev) => prev.filter((req) => req.id !== id));
      setDetails((prev) => prev.filter((detail) => detail.id !== id));
  
      alert(`${name} has been added as a friend.`);
    } catch (error) {
      console.error("Error accepting friend request:", error);
      alert("Failed to accept friend request. Please try again.");
    }
  };
  
  
  
  const rejectFriendRequest = async (id, name) => {
    try {
      const userDocRef = doc(db, "users", user.uid);
  
      // Remove from friend requests
    // Accept Friend Request
    await updateDoc(userDocRef, {
      friendRequests: arrayRemove({ id, name }), // Only remove the ID
    });
    await updateDoc(doc(db,"users",id),{
      sentRequests: arrayRemove(user.uid)
    })
 // Pass the full object to match
     
  
      // Update UI
      setRequests((prev) => prev.filter((req) => req.id !== id));
      setDetails((prev) => prev.filter((detail) => detail.id !== id));
      alert(`Friend request from ${name} has been rejected.`);
    } catch (error) {
      console.error("Error rejecting friend request:", error);
      alert("Failed to reject friend request. Please try again.");
    }
  };
  
  
  

  if (loading) {
    return <div>Loading friend requests...</div>;
  }

  return (
    <div className="bg-white h-screen p-4 md:p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Friend Requests</h1>
      <div className="space-y-4">
        {details.length > 0 ? (
          details.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between bg-gray-50 p-4 rounded-xl shadow-md hover:shadow-lg transition"
            >
              {/* Profile Picture */}
              <div className="flex items-center">
                <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-gray-300">
                  <img
                    src={item.profilePic || "https://via.placeholder.com/150"}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="ml-4">
                  <h2 className="font-medium text-lg">{item.name}</h2>
                  <p className="text-sm text-gray-500">Wants to connect</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-2">
                <button
                  onClick={() => acceptFriendRequest(item.id, item.name)}
                  className="px-4 py-2 text-green-500 border border-green-500 rounded-full hover:bg-green-500 hover:text-white transition"
                >
                  Accept
                </button>
                <button
                  onClick={() => rejectFriendRequest(item.id, item.name)}
                  className="px-4 py-2 text-red-500 border border-red-500 rounded-full hover:bg-red-500 hover:text-white transition"
                >
                  Reject
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No friend requests</p>
        )}
      </div>
    </div>
  );
}

export default Requests;
