import React from "react";
import Allchats from "./Allchatside";
import Chats from "./Chats";

function Allchat() {
  return (
    <div className="flex flex-col sm-max:w-full   md:flex-row gap-5 bg-white rounded-3xl mt-7 mx-2 justify-center p-4">
      {/* Sidebar (Chat List) */}
      <Allchats />
      {/* Chat Window */}
      <Chats />
    </div>
  );
}

export default Allchat;
