import React, { useContext } from 'react';
import { context } from '../Context/Global';
import { Navigate } from 'react-router-dom';

function Protected1({ children }) {
  const { user } = useContext(context);

  // Redirect authenticated users to "/chat"
  if (user) {
    return <Navigate to="/chat" replace />;
  }

  // If unauthenticated, allow access to children (e.g., AuthForm)
  return children;
}

export default Protected1;
