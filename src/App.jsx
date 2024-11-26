import React, { useContext } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Allchat from "./components/Allchat";
import Requests from "./components/Requests";
import Addfriend from "./components/Addfriend";
import Profile from "./components/Profile";
import AuthForm from "./components/Sign";
import { context } from "./Context/Global";
import Protected from "./Protected/Protected";
import Protected1 from "./Protected/Protected1";

function App() {
  const { user } = useContext(context);

  return (
    <div className="h-screen flex bg-gray-100">
      
        {/* Sidebar */}
        {user && <Sidebar />}

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <Routes>
            {/* Public Route */}
            <Route path="/" element={<Protected1><AuthForm /></Protected1>} />

            {/* Protected Routes */}
            <Route path="/chat" element={<Protected><Allchat /></Protected>} />
            <Route path="/request" element={<Protected><Requests /></Protected>} />
            <Route path="/addfriend" element={<Protected><Addfriend /></Protected>} />
            <Route path="/profile" element={<Protected><Profile /></Protected>} />
          </Routes>
        </div>
     
    </div>
  );
}

export default App;
