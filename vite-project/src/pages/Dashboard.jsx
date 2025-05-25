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

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [activeMenu, setActiveMenu] = useState("dashboard");
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [chatMode, setChatMode] = useState(null);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [language, setLanguage] = useState("English");
  const [privacySetting, setPrivacySetting] = useState("Public");
  const navigate = useNavigate();
  const [communicationMode, setCommunicationMode] = useState("");



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

  const handleLogout = async () => {
    await supabase.auth.signOut();
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
    if (!feedback.trim()) return;

    try {
      await supabase.from("feedback").insert([{ user_id: user.id, content: feedback }]);
      setFeedback("");
      alert("Feedback submitted successfully!");
    } catch (error) {
      console.error("Error submitting feedback:", error.message);
      alert("Failed to submit feedback.");
    }
  };

  const handleChatModeSelect = (mode) => {
    setChatMode(mode);
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

            {/* Feedback Form */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
              <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-4">
                Feedback
              </h3>
              <form onSubmit={handleFeedbackSubmit}>
                <textarea
                  className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                  rows="4"
                  placeholder="Enter your feedback here..."
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                ></textarea>
                <button
                  type="submit"
                  className="mt-3 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
                >
                  Submit Feedback
                </button>
              </form>
            </div>
          </div>
        );
      case "messages":
        return <div className="p-4 md:p-6">Messages Content</div>;
      case "schedule":
        return (
          <div className="p-4 md:p-6">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-gray-200">
              Schedule
            </h2>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
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
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-200">
                        2023-10-15
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        10:00 AM
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        John Doe
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        Massage Therapy
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-200">
                        2023-10-16
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        02:00 PM
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        Jane Smith
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        Facial Treatment
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-200">
                        2023-10-17
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        11:00 AM
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        Alice Johnson
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        Aromatherapy
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
       case "ai-agent":
  return (
    <div className="p-4 md:p-6 flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center mb-4">
        <AiOutlineRobot className="text-2xl text-indigo-600 dark:text-indigo-400 mr-3" />
        <h3 className="text-xl font-medium dark:text-gray-200">Yuvika Spa Multiagent</h3>
      </div>

      {/* Status */}
      <div className="p-4 bg-indigo-50 dark:bg-gray-700 rounded-lg mb-6">
        <p className="font-medium dark:text-gray-200">
          Current Status:{" "}
          <span className="text-green-600 dark:text-green-400">Active</span>
        </p>
      </div>

      {/* Chat Mode Selection */}
      {!chatMode && (
        <div className="space-y-4">
          <h4 className="font-medium dark:text-gray-200">Select Chat Mode:</h4>
          <button
            className={`px-4 py-3 rounded-lg ${
              chatMode === "Multi Agent Mode"
                ? "bg-indigo-600 text-white"
                : "bg-indigo-500 text-white"
            }`}
            onClick={() => {
              setChatMode("Multi Agent Mode");
              setCommunicationMode("");
            }}
          >
            <span className="font-medium">Multi Agent Mode</span>
            <p className="text-xs text-white mt-1 opacity-80">
              Engage with multiple agents in a unified session.
            </p>
          </button>
        </div>
      )}

      {/* Communication Mode Selection */}
      {chatMode === "Multi Agent Mode" && !communicationMode && (
        <div className="space-y-4 mt-6">
          <h4 className="font-medium dark:text-gray-200">
            Select Communication Mode:
          </h4>
          <div className="flex space-x-6">
            {["Text Mode", "Voice Mode"].map((mode) => (
              <div
                key={mode}
                className={`flex flex-col items-center p-4 rounded-lg cursor-pointer transition-all duration-200 ${
                  communicationMode === mode
                    ? "bg-indigo-100 dark:bg-indigo-900 ring-2 ring-indigo-500 dark:ring-indigo-400"
                    : "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
                }`}
                onClick={() => setCommunicationMode(mode)}
              >
                <div className="h-16 w-16 rounded-full bg-indigo-500 flex items-center justify-center mb-3 shadow-md">
                  <span className="text-white text-xl font-bold">
                    {mode.charAt(0)}
                  </span>
                </div>
                <span className="text-white font-medium">{mode}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Text Chat UI */}
      {communicationMode === "Text Mode" && (
        <div className="flex flex-col h-full">
          {/* Chat Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 bg-gray-100 dark:bg-gray-800 rounded-lg mb-2">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              No messages yet. Start typing below...
            </p>
          </div>

          {/* Input + Send Button */}
          <div className="sticky bottom-0 bg-white dark:bg-gray-800 border-t dark:border-gray-700 pt-3 pb-6 px-2 flex items-center space-x-2">
            <input
              type="text"
              placeholder="Type your message..."
              className="flex-1 p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  alert(`Message sent: ${e.target.value}`);
                  e.target.value = "";
                }
              }}
            />
            <button
              className="p-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
              onClick={() => {
                const input = document.querySelector(".chat-input");
                if (input.value.trim()) {
                  alert(`Message sent: ${input.value}`);
                  input.value = "";
                }
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Voice Mode Placeholder */}
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
                  <h3 className="text-lg font-medium dark:text-gray-200">Notification Settings</h3>
                  <div className="flex items-center space-x-4">
                    <FiBell className="text-gray-500 dark:text-gray-300" />
                    <div className="flex items-center justify-between w-full">
                      <div>
                        <p className="font-medium dark:text-gray-200">Enable Notifications</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Turn on/off notifications
                        </p>
                      </div>
                      <label className="switch">
                        <input
                          type="checkbox"
                          checked={notificationsEnabled}
                          onChange={() => setNotificationsEnabled(!notificationsEnabled)}
                        />
                        <span className="slider round"></span>
                      </label>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <FiMail className="text-gray-500 dark:text-gray-300" />
                    <div className="flex items-center justify-between w-full">
                      <div>
                        <p className="font-medium dark:text-gray-200">Email Notifications</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Receive updates via email
                        </p>
                      </div>
                      <label className="switch">
                        <input
                          type="checkbox"
                          checked={emailNotifications}
                          onChange={() => setEmailNotifications(!emailNotifications)}
                        />
                        <span className="slider round"></span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Security Settings */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium dark:text-gray-200">Security Settings</h3>
                  <div className="flex items-center space-x-4">
                    <FiAlertCircle className="text-gray-500 dark:text-gray-300" />
                    <div>
                      <p className="font-medium dark:text-gray-200">Two-Factor Authentication</p>
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
        className={`hidden md:flex flex-col ${
          darkMode ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"
        } border-r ${sidebarOpen ? "w-64" : "w-20"}`}
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
