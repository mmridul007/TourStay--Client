// import React, { useState } from "react";
// import { Chatbot } from "react-chatbot-kit";
// import "react-chatbot-kit/build/main.css";

// import config from "./chatbot/config";
// import MessageParser from "./chatbot/MessageParser";
// import ActionProvider from "./chatbot/ActionProvider";

// import "./ChatBot.css";

// const ChatBot = () => {
//   const [isOpen, setIsOpen] = useState(false);

//   return (
//     <div className="chatbot-container">
//       {/* Minimized chat button */}
//       {!isOpen && (
//         <button className="chat-button" onClick={() => setIsOpen(true)}>
//           Chat with us
//         </button>
//       )}

//       {/* Expanded chat window */}
//       {isOpen && (
//         <div className="chatbot-wrapper">
//           <div className="chatbot-header">
//             <h3>Hotel & Quick Stay Assistant</h3>
//             <button className="close-button" onClick={() => setIsOpen(false)}>
//               ✕
//             </button>
//           </div>

//           <div className="chatbot-content">
//             <Chatbot
//               config={config}
//               messageParser={MessageParser}
//               actionProvider={ActionProvider}
//             />
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ChatBot;

import React, { useState, useContext } from "react";
import { Chatbot } from "react-chatbot-kit";
import "react-chatbot-kit/build/main.css";

import config from "./chatbot/config";
import MessageParser from "./chatbot/MessageParser";
import ActionProvider from "./chatbot/ActionProvider";

import "./ChatBot.css";
import { SearchContext } from "./context/SearchContext";

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { dispatch } = useContext(SearchContext);

  // Create a custom ActionProvider class that includes dispatch
  const CustomActionProvider = (function () {
    return class extends ActionProvider {
      constructor(createChatBotMessage, setStateFunc, createClientMessage) {
        super(createChatBotMessage, setStateFunc, createClientMessage);
        this.dispatch = dispatch; // Attach dispatch to the instance
      }
    };
  })();

  return (
    <div className="chatbot-container">
      {!isOpen && (
        <button className="chat-button" onClick={() => setIsOpen(true)}>
          Chat with us
        </button>
      )}

      {isOpen && (
        <div className="chatbot-wrapper">
          <div className="chatbot-header">
            <h3>Hotel & Quick Stay Assistant</h3>
            <button className="close-button" onClick={() => setIsOpen(false)}>
              ✕
            </button>
          </div>

          <div className="chatbot-content">
            <Chatbot
              config={config}
              messageParser={MessageParser}
              actionProvider={CustomActionProvider} // Pass the class, not an instance
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBot;
