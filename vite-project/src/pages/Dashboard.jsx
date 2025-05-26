import React, { useState, useEffect } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { supabase } from "../config/supabaseClient";
import {
  FiHome,
  FiMessageSquare,
  FiCalendar,
  FiSettings,
  FiLogOut,
  FiSun,
  FiMoon,
  FiUser,
  FiBell,
  FiLock,
  FiGlobe,
  FiMail,
  FiAlertCircle,
} from "react-icons/fi";
import { AiOutlineRobot } from "react-icons/ai";
import LoadingSpinner from "../components/LoadingSpinner";
import AIChatInterface from "../components/AIChatInterface";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [activeMenu, setActiveMenu] = useState("dashboard");
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  // Feedback form states
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [feedback, setFeedback] = useState(""); // message content

  // Additional features from first code
  const [chatMode, setChatMode] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loadingAppointments, setLoadingAppointments] = useState(false);
  const [broadcastMessages, setBroadcastMessages] = useState(() => {
    const savedMessages = localStorage.getItem("broadcastMessages");
    return savedMessages ? JSON.parse(savedMessages) : [];
  });

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [language, setLanguage] = useState("English");
  const [privacySetting, setPrivacySetting] = useState("Public");
  const [communicationMode, setCommunicationMode] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const navigate = useNavigate();

  // Load saved theme preference
  useEffect(() => {
    const savedMode = localStorage.getItem("darkMode") === "true";
    if (savedMode) {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  // Fetch user & messages
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        setUser(user);

        if (!user) return;

        const { count } = await supabase
          .from("messages")
          .select("*", { count: "exact" })
          .eq("read", false)
          .eq("recipient_id", user.id);

        setUnreadMessages(count || 0);
      } catch (error) {
        console.error("Error fetching user or messages:", error.message);
      }
    };

    fetchUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT") navigate("/login");
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, [navigate]);


  // Fetch appointments
  useEffect(() => {
    const fetchAppointments = async () => {
      if (user) { 
        setLoadingAppointments(true);
        try {
          const { data, error } = await supabase
            .from('appointments')
            .select('date, time, name, service') 
            .eq('email', user.email) 
            .order('date', { ascending: true })
            .order('time', { ascending: true });

          if (error) {
            throw error;
          }
          setAppointments(data || []);
        } catch (error) {
          console.error("Error fetching appointments:", error.message);
          alert("Could not fetch appointments: " + error.message);
          setAppointments([]); 
        }
        setLoadingAppointments(false);
      }
    };

    fetchAppointments();
  }, [user]); 

  // Subscribe to broadcast messages
  useEffect(() => {
    // Ensure Supabase client is available
    if (!supabase) {
        console.warn('Supabase client not available for broadcast subscription.');
        return; // Exit if supabase is not initialized
    }
  
    const channel = supabase.channel('broadcast-channel');
  
    channel
      .on(
        'broadcast',
        { event: 'new-message' }, // Listen for a specific event named 'new-message'
        (payload) => {
          console.log('New broadcast message received!', payload);
          // Assuming payload.payload is the message object { id, content, sender, timestamp }
          setBroadcastMessages((prevMessages) => {
            const newMessages = [payload.payload, ...prevMessages];
            // Save messages to localStorage
            localStorage.setItem('broadcastMessages', JSON.stringify(newMessages));
            return newMessages;
          }); 
        }
      )
      .subscribe((status,err) => {
        if (status === 'SUBSCRIBED') {
          console.log('Subscribed to broadcast channel!');
        } else if (status === 'CHANNEL_ERROR') {
          console.error('Error subscribing to broadcast channel. Status:', status, 'Error:', err);
        } else if (status === 'TIMED_OUT') {
          console.warn('Broadcast channel subscription timed out. Status:', status, 'Error:', err);
        } else {
          console.log('Broadcast channel status:', status); // Log other statuses
        }
      });
  
    // Cleanup subscription on component unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, []); // Empty dependency array means this effect runs once on mount and cleans up on unmount

  // Save broadcastMessages to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('broadcastMessages', JSON.stringify(broadcastMessages));
  }, [broadcastMessages]);

  const handleLogout = async () => {
    // await supabase.auth.signOut(); // Commenting out Supabase
    navigate("/login");
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem("darkMode", newMode);
    if (newMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim() || !subject.trim() || !feedback.trim()) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/api/send-feedback', { // Assuming your backend runs on port 3001
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          fullName,
          email,
          subject,
          message: feedback 
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setFullName("");
        setEmail("");
        setSubject("");
        setFeedback("");
        alert(result.message || "Feedback submitted successfully!");
      } else {
        throw new Error(result.error || 'Failed to submit feedback.');
      }
    } catch (error) {
      console.error("Error submitting feedback:", error.message);
      alert(error.message || "Failed to submit feedback. Please try again.");
    }
  };

  const handleChatModeSelect = (mode) => {
    setChatMode(mode);
  };

  const handleSendMessage = async (message) => {
    setIsProcessing(true);

    try {
      const response = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });

      if (!response.ok) throw new Error("API request failed");

      const data = await response.json();

      setChatMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          type: "user",
          content: message,
          timestamp: new Date(),
        },
        {
          id: Date.now() + 1,
          type: "ai",
          content: data.response,
          timestamp: new Date(),
        },
      ]);
    } catch (error) {
      setChatMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          type: "error",
          content: error.message,
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsProcessing(false);
    }
  };

  const startNewConversation = () => {
    if (!chatMode) {
      alert("Please select a chat mode.");
      return;
    }
    alert(`Starting new ${chatMode} conversation.`);
    // Add logic to start a new conversation
  };

  const renderContent = () => {
    switch (activeMenu) {
      case "dashboard":
        return (
          <div className="p-4 md:p-6">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-gray-200">
              Welcome to Yuvika Spa House
            </h2>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                <h3 className="font-medium text-gray-700 dark:text-gray-300">
                  Today's Appointments
                </h3>
                <p className="text-3xl font-bold mt-2 text-indigo-600 dark:text-indigo-400">
                  12
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  +2 from yesterday
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                <h3 className="font-medium text-gray-700 dark:text-gray-300">
                  New Messages
                </h3>
                <p className="text-3xl font-bold mt-2 text-indigo-600 dark:text-indigo-400">
                  {unreadMessages}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Waiting for reply
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                <h3 className="font-medium text-gray-700 dark:text-gray-300">
                  AI Agent Status
                </h3>
                <div className="flex items-center mt-2">
                  <span className="h-3 w-3 rounded-full bg-green-500 mr-2"></span>
                  <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                    Ready
                  </p>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Active and responsive
                </p>
              </div>
            </div>

            {/* Chart */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm mb-8">
              <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-4">
                Appointment Trends
              </h3>
              <div className="h-64">
                {/* Placeholder for Chart */}
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-500 dark:text-gray-400">Chart will be rendered here</p>
                </div>
              </div>
            </div>

            {/* Feedback Form Updated */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm mt-8"> {/* Added mt-8 for spacing */}
              <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-4">
                Feedback
              </h3>
              <form onSubmit={handleFeedbackSubmit}>
                <div className="mb-4">
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName" // Added name attribute
                    className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Enter your full name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email" // Added name attribute
                    className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Subject</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject" // Added name attribute
                    className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Enter the subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="feedbackMessage" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Message</label>
                  <textarea
                    id="feedbackMessage"
                    name="message" // Changed from feedback to message to match backend
                    className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 focus:ring-indigo-500 focus:border-indigo-500"
                    rows="4"
                    placeholder="Enter your message here..."
                    value={feedback} // This state is still named 'feedback'
                    onChange={(e) => setFeedback(e.target.value)} // This updates the 'feedback' state
                    required
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="mt-3 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Submit Feedback
                </button>
              </form>
            </div>
          </div>
        );
      case "messages":
        return (
          <div className="p-4 md:p-6">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-gray-200">
              Broadcast Messages
            </h2>
            {broadcastMessages.length === 0 ? (
              <p className="text-center text-gray-500 dark:text-gray-400 py-4">
                No new broadcast messages.
              </p>
            ) : (
              <div className="space-y-4">
                {broadcastMessages.map((msg) => (
                  <div 
                    key={msg.id || msg.timestamp} // Use a unique key, id or timestamp
                    className={`p-4 rounded-lg shadow ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border`}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className={`font-semibold ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>
                        {msg.sender || 'Admin Broadcast'}
                      </span>
                      <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {msg.timestamp ? new Date(msg.timestamp).toLocaleString() : ''}
                      </span>
                    </div>
                    <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {msg.content}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      case "schedule":
        return (
          <div className="p-4 md:p-6">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-gray-200">
              Schedule
            </h2>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
              {loadingAppointments ? (
                <LoadingSpinner />
              ) : appointments.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Time
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Client
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Service
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {appointments.map((appointment, index) => (
                        <tr key={appointment.id || index}> {/* Use appointment.id if available and unique, otherwise index */}
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-200">
                            {new Date(appointment.date).toLocaleDateString()} {/* Format date if needed */}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                            {appointment.time}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                            {appointment.name} {/* This is 'name' from your Supabase table, representing the client */}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                            {appointment.service}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-center text-gray-500 dark:text-gray-400 py-4">
                  No appointments scheduled.
                </p>
              )}
            </div>
          </div>
        );
        case "ai-agent":
          return (
            <div className="p-4 md:p-6 flex flex-col h-full">
              <div className="flex items-center mb-4">
                <AiOutlineRobot className="text-2xl text-indigo-600 dark:text-indigo-400 mr-3" />
                <h3 className="text-xl font-medium dark:text-gray-200">
                  Yuvika Spa Multiagent
                </h3>
              </div>
  
              {/* Mode selection logic */}
              <div className="space-y-4">
                <button
                  onClick={() => handleChatModeSelect("Multi Agent Mode")}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg"
                >
                  Multi Agent Mode
                </button>
              </div>
  
              {/* Communication mode selection */}
              {chatMode === "Multi Agent Mode" && !communicationMode && (
                <div className="space-y-4 mt-6">
                  <button
                    onClick={() => setCommunicationMode("Text Mode")}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg"
                  >
                    Text Mode
                  </button>
                </div>
              )}
  
              {/* Chat interface */}
              {communicationMode === "Text Mode" && (
                <AIChatInterface
                  messages={chatMessages}
                  onSendMessage={handleSendMessage}
                  isProcessing={isProcessing}
                />
              )}
  
              {/* Voice mode placeholder */}
              {communicationMode === "Voice Mode" && (
                <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg text-center">
                  <p className="text-gray-600 dark:text-gray-300">
                    Voice mode is not implemented yet.
                  </p>
                </div>
              )}
            </div>
          );
  
        case "settings":
          return (
            <div className="p-4 md:p-6">
              <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-gray-200">
                Settings
              </h2>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                <div className="space-y-6">
                  {/* Notification Settings */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium dark:text-gray-200">
                      Notification Settings
                    </h3>
                    <div className="flex items-center space-x-4">
                      <FiBell className="text-gray-500 dark:text-gray-300" />
                      <div className="flex items-center justify-between w-full">
                        <div>
                          <p className="font-medium dark:text-gray-200">
                            Enable Notifications
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Turn on/off notifications
                          </p>
                        </div>
                        <label className="switch">
                          <input
                            type="checkbox"
                            checked={notificationsEnabled}
                            onChange={() =>
                              setNotificationsEnabled(!notificationsEnabled)
                            }
                          />
                          <span className="slider round"></span>
                        </label>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <FiMail className="text-gray-500 dark:text-gray-300" />
                      <div className="flex items-center justify-between w-full">
                        <div>
                          <p className="font-medium dark:text-gray-200">
                            Email Notifications
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Receive updates via email
                          </p>
                        </div>
                        <label className="switch">
                          <input
                            type="checkbox"
                            checked={emailNotifications}
                            onChange={() =>
                              setEmailNotifications(!emailNotifications)
                            }
                          />
                          <span className="slider round"></span>
                        </label>
                      </div>
                    </div>
                  </div>
  
                  {/* Security Settings */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium dark:text-gray-200">
                      Security Settings
                    </h3>
                    <div className="flex items-center space-x-4">
                      <FiAlertCircle className="text-gray-500 dark:text-gray-300" />
                      <div>
                        <p className="font-medium dark:text-gray-200">
                          Two-Factor Authentication
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Enable two-factor authentication for added security
                        </p>
                        <button
                          className="mt-2 px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg transition-colors relative group"
                          disabled
                        >
                          Enable
                          <span className="absolute left-0 bottom-full mb-2 opacity-0 group-hover:opacity-100 bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap transition-opacity">
                            Coming Soon
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        default:
          return <div className="p-4 md:p-6">Select a menu item</div>;
      }
    };
  
    if (!user) {
      return (
        <div className="flex justify-center items-center h-screen bg-gray-50 dark:bg-gray-900">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 dark:border-indigo-400"></div>
        </div>
      );
    }
  
    return (
      <div className={`flex h-screen ${darkMode ? "dark" : ""}`}>
        {/* Sidebar - Desktop */}
        <div
          className={`md:flex flex-col ${
            darkMode ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"
          } border-r w-64 ${sidebarOpen ? "" : "hidden"}`}
        >
          <div
            className={`p-4 border-b ${
              darkMode ? "border-gray-700" : "border-gray-200"
            } flex items-center justify-between`}
          >
            {sidebarOpen ? (
              <h1
                className={`text-xl font-bold ${
                  darkMode ? "text-indigo-400" : "text-indigo-600"
                }`}
              >
                Yuvika Spa
              </h1>
            ) : (
              <h1
                className={`text-xl font-bold ${
                  darkMode ? "text-indigo-400" : "text-indigo-600"
                }`}
              >
                YS
              </h1>
            )}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className={`p-1 rounded-md ${
                darkMode ? "hover:bg-gray-800" : "hover:bg-gray-100"
              }`}
            >
              {sidebarOpen ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-5 w-5 ${
                    darkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M15.707 15.707a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 010 1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-5 w-5 ${
                    darkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.293 15.707a1 1 0 010-1.414L14.586 10l-4.293-4.293a1 1 0 111.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </button>
          </div>
  
          <nav className="flex-1 p-4 space-y-1">
            <NavLink
              to="#"
              onClick={() => setActiveMenu("dashboard")}
              className={({ isActive }) =>
                `flex items-center p-3 rounded-lg ${
                  isActive
                    ? darkMode
                      ? "bg-indigo-900 text-indigo-100"
                      : "bg-indigo-50 text-indigo-600"
                    : darkMode
                    ? "text-gray-300 hover:bg-gray-800"
                    : "text-gray-600 hover:bg-gray-100"
                }`
              }
            >
              <FiHome className="text-lg" />
              {sidebarOpen && <span className="ml-3">Dashboard</span>}
            </NavLink>
  
            <NavLink
              to="#"
              onClick={() => setActiveMenu("messages")}
              className={({ isActive }) =>
                `flex items-center p-3 rounded-lg ${
                  isActive
                    ? darkMode
                      ? "bg-indigo-900 text-indigo-100"
                      : "bg-indigo-50 text-indigo-600"
                    : darkMode
                    ? "text-gray-300 hover:bg-gray-800"
                    : "text-gray-600 hover:bg-gray-100"
                }`
              }
            >
              <div className="relative">
                <FiMessageSquare className="text-lg" />
                {unreadMessages > 0 && (
                  <span className="absolute -top-2 -right-2 h-5 w-5 bg-red-500 text-white text-xs flex items-center justify-center rounded-full">
                    {unreadMessages}
                  </span>
                )}
              </div>
              {sidebarOpen && <span className="ml-3">Messages</span>}
            </NavLink>
  
            <NavLink
              to="#"
              onClick={() => setActiveMenu("schedule")}
              className={({ isActive }) =>
                `flex items-center p-3 rounded-lg ${
                  isActive
                    ? darkMode
                      ? "bg-indigo-900 text-indigo-100"
                      : "bg-indigo-50 text-indigo-600"
                    : darkMode
                    ? "text-gray-300 hover:bg-gray-800"
                    : "text-gray-600 hover:bg-gray-100"
                }`
              }
            >
              <FiCalendar className="text-lg" />
              {sidebarOpen && <span className="ml-3">Schedule</span>}
            </NavLink>
  
            <NavLink
              to="#"
              onClick={() => setActiveMenu("ai-agent")}
              className={({ isActive }) =>
                `flex items-center p-3 rounded-lg ${
                  isActive
                    ? darkMode
                      ? "bg-indigo-900 text-indigo-100"
                      : "bg-indigo-50 text-indigo-600"
                    : darkMode
                    ? "text-gray-300 hover:bg-gray-800"
                    : "text-gray-600 hover:bg-gray-100"
                }`
              }
            >
              <AiOutlineRobot className="text-lg" />
              {sidebarOpen && <span className="ml-3">AI Agent</span>}
            </NavLink>
          </nav>
  
          <div
            className={`p-4 border-t ${
              darkMode ? "border-gray-700" : "border-gray-200"
            } space-y-1`}
          >
            <NavLink
              to="#"
              onClick={() => setActiveMenu("settings")}
              className={({ isActive }) =>
                `flex items-center p-3 rounded-lg ${
                  isActive
                    ? darkMode
                      ? "bg-indigo-900 text-indigo-100"
                      : "bg-indigo-50 text-indigo-600"
                    : darkMode
                    ? "text-gray-300 hover:bg-gray-800"
                    : "text-gray-600 hover:bg-gray-100"
                }`
              }
            >
              <FiSettings className="text-lg" />
              {sidebarOpen && <span className="ml-3">Settings</span>}
            </NavLink>
  
            <button
              onClick={handleLogout}
              className={`flex items-center w-full p-3 rounded-lg ${
                darkMode
                  ? "text-gray-300 hover:bg-gray-800"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <FiLogOut className="text-lg" />
              {sidebarOpen && <span className="ml-3">Logout</span>}
            </button>
          </div>
        </div>
        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden bg-gray-50 dark:bg-gray-900">
          <header
            className={`${
              darkMode
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-200"
            } border-b`}
          >
            <div className="px-4 py-3 flex justify-between items-center w-full">
              <div className="flex items-center md:hidden">
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className={`p-2 rounded-md ${
                    darkMode
                      ? "text-gray-400 hover:text-gray-300 hover:bg-gray-700"
                      : "text-gray-500 hover:text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                </button>
                <h2
                  className={`ml-2 text-lg font-semibold ${
                    darkMode ? "text-gray-200" : "text-gray-800"
                  } capitalize`}
                >
                  {activeMenu.replace("-", " ")}
                </h2>
              </div>
  
              <div className="flex items-center space-x-4">
                {/* Icons on the right side of the header */}
                <button
                  className={`p-2 rounded-full ${
                    darkMode
                      ? "text-gray-400 hover:bg-gray-700"
                      : "text-gray-500 hover:bg-gray-100"
                  }`}
                >
                  <FiBell className="text-xl" />
                </button>
                <button
                  className={`p-2 rounded-full ${
                    darkMode
                      ? "text-gray-400 hover:bg-gray-700"
                      : "text-gray-500 hover:bg-gray-100"
                  }`}
                >
                  <FiMail className="text-xl" />
                </button>
                <button
                  onClick={toggleDarkMode}
                  className={`p-2 rounded-full ${
                    darkMode
                      ? "text-gray-400 hover:bg-gray-700"
                      : "text-gray-500 hover:bg-gray-100"
                  }`}
                >
                  {darkMode ? (
                    <FiSun className="text-xl" />
                  ) : (
                    <FiMoon className="text-xl" />
                  )}
                </button>
  
                <div className="flex items-center">
                  <img
                    src={
                      user.user_metadata?.avatar_url ||
                      `https://ui-avatars.com/api/?name= ${user.email}&background=indigo&color=fff`
                    }
                    alt="User"
                    className="h-8 w-8 rounded-full"
                  />
                  {sidebarOpen && (
                    <span
                      className={`ml-2 text-sm font-medium ${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {user.user_metadata?.full_name || user.email.split("@")[0]}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </header>
  
          <main className="flex-1 overflow-y-auto w-full">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              {renderContent()}
            </div>
          </main>
        </div>
      </div>
    );
  };
  
  export default Dashboard;
  
