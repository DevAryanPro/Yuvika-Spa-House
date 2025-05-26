import React from "react";
import { FiSend } from "react-icons/fi";

const AIChatInterface = ({ messages, onSendMessage, isProcessing }) => {
  const [inputMessage, setInputMessage] = React.useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputMessage.trim() && !isProcessing) {
      onSendMessage(inputMessage);
      setInputMessage("");
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto mb-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`p-3 rounded-lg max-w-[80%] ${
              msg.type === "user"
                ? "ml-auto bg-indigo-100 dark:bg-indigo-900"
                : "bg-gray-100 dark:bg-gray-800"
            }`}
          >
            <p className="text-gray-800 dark:text-gray-200">{msg.content}</p>
            <time className="text-xs text-gray-500 mt-1 block">
              {new Date(msg.timestamp).toLocaleTimeString()}
            </time>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
          disabled={isProcessing}
        />
        <button
          type="submit"
          className="p-2 bg-indigo-600 text-white rounded-lg disabled:opacity-50"
          disabled={isProcessing}
        >
          <FiSend className="text-lg" />
        </button>
      </form>
    </div>
  );
};

export default AIChatInterface;
