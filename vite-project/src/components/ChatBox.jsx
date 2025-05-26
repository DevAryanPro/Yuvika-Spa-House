import React, { useState, useEffect, useRef } from "react";

const ChatBox = ({ messages, onSend, isProcessing }) => {
  const [inputMessage, setInputMessage] = useState("");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || isProcessing) return;
    onSend(inputMessage);
    setInputMessage("");
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50 dark:bg-gray-800 rounded-lg mb-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${
              msg.type === "user" ? "justify-end" : "justify-start"
            } mb-4`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                msg.type === "user"
                  ? "bg-indigo-600 text-white"
                  : "bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 border"
              }`}
            >
              <p className="text-sm">{msg.content}</p>
              <p
                className={`text-xs mt-1 ${
                  msg.type === "user" ? "text-indigo-100" : "text-gray-500"
                }`}
              >
                {new Date(msg.timestamp).toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form
        onSubmit={handleSubmit}
        className="sticky bottom-0 bg-white dark:bg-gray-800 pt-3"
      >
        <div className="flex items-end space-x-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type your message..."
            className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            disabled={isProcessing}
          />
          <button
            type="submit"
            className="p-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
            disabled={isProcessing || !inputMessage.trim()}
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatBox;
