import React, { createContext, useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase/Firebase";

export const context = createContext();

function Global({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [chat, setchat] = useState([]); 
  const [onlivefriend, setonlivefriend] = useState({
    name: "",
    id:""
  }); 
  const handleLogout = async () => {
    try {
      await signOut(auth);
      alert("Logged out successfully!");
      navigate("/"); // Redirect to Sign-In page
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser || null);
      setLoading(false); // Firebase auth state has initialized
    });

    return () => unsubscribe();
  }, []);

  return (
    <context.Provider value={{ user,setUser, loading, handleLogout,chat,setchat,onlivefriend, setonlivefriend }}>
      {children}
    </context.Provider>
  );
}

export default Global;
