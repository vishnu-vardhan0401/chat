import React, { useContext, useEffect } from "react";
import { context } from "../Context/Global";
import { Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/Firebase";

function Protected({ children }) {
  const { user, setUser } = useContext(context);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  // Redirect unauthenticated users to login page
  if (!user) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default Protected;
