import React, { useState } from 'react';
import { supabase } from '../config/supabaseClient'; // Adjust path as needed

const ADMIN_KEY = 'supersecretadminkey123'; // Replace with your desired admin key

const AdminBroadcast = () => {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [adminKeyInput, setAdminKeyInput] = useState('');
  const [messageContent, setMessageContent] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');

  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (adminKeyInput === ADMIN_KEY) {
      setIsAdminAuthenticated(true);
      setFeedbackMessage('');
    } else {
      setFeedbackMessage('Incorrect Admin Key.');
    }
    setAdminKeyInput('');
  };

  const handleSendBroadcast = async () => {
    if (!messageContent.trim()) {
      setFeedbackMessage('Message content cannot be empty.');
      return;
    }
    setIsSending(true);
    setFeedbackMessage('');

    const channel = supabase.channel('broadcast-channel');

    try {
      const res = await channel.send({
        type: 'broadcast',
        event: 'new-message', // Must match the event client is listening to in Dashboard.jsx
        payload: {
          id: `msg_${Date.now()}`,
          content: messageContent,
          sender: 'Admin Broadcast',
          timestamp: new Date().toISOString(),
        },
      });

      if (res === 'ok') {
        setFeedbackMessage('Broadcast sent successfully!');
        setMessageContent(''); // Clear message input after sending
      } else {
        setFeedbackMessage('Failed to send broadcast. Status: ' + res);
      }
    } catch (error) {
      console.error('Error sending broadcast:', error);
      setFeedbackMessage(`Error sending broadcast: ${error.message}`);
    } finally {
      setIsSending(false);
      // It's good practice to remove the channel if it's only used for sending and not listening
      // However, for simplicity in this demo, we might omit this or ensure it's handled if the component unmounts.
      // supabase.removeChannel(channel); // Consider if/when to do this.
    }
  };

  if (!isAdminAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
        <div className="w-full max-w-md p-8 bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-200 mb-6">
            Admin Broadcast Login
          </h1>
          <form onSubmit={handleAdminLogin}>
            <div className="mb-4">
              <label htmlFor="adminKey" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Admin Key
              </label>
              <input
                type="password"
                id="adminKey"
                value={adminKeyInput}
                onChange={(e) => setAdminKeyInput(e.target.value)}
                className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Login
            </button>
          </form>
          {feedbackMessage && (
            <p className={`mt-4 text-center text-sm ${feedbackMessage.includes('Incorrect') ? 'text-red-500' : 'text-green-500'}`}>
              {feedbackMessage}
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <div className="w-full max-w-lg p-8 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-200 mb-6">
          Send Broadcast Message
        </h1>
        <div className="mb-4">
          <label htmlFor="messageContent" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Message
          </label>
          <textarea
            id="messageContent"
            rows="5"
            value={messageContent}
            onChange={(e) => setMessageContent(e.target.value)}
            className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter your broadcast message here..."
          />
        </div>
        <button
          onClick={handleSendBroadcast}
          disabled={isSending}
          className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
        >
          {isSending ? 'Sending...' : 'Send Broadcast'}
        </button>
        {feedbackMessage && (
          <p className={`mt-4 text-center text-sm ${feedbackMessage.includes('Error') || feedbackMessage.includes('Failed') ? 'text-red-500' : 'text-green-500'}`}>
            {feedbackMessage}
          </p>
        )}
         <button
            onClick={() => setIsAdminAuthenticated(false)} // Logout button
            className="mt-4 w-full px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
          >
            Logout Admin
          </button>
      </div>
    </div>
  );
};

export default AdminBroadcast;
