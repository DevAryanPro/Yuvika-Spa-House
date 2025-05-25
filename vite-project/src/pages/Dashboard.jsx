import React, { useState, useEffect } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { supabase } from "../config/supabaseClient";
import {
  FiHome,
  FiMessageSquare,
  FiCalendar,
  FiSettings,
  FiUsers,
  FiLogOut,
  FiSun,
  FiMoon,
} from "react-icons/fi";
import { AiOutlineRobot } from "react-icons/ai";
import LoadingSpinner from "../components/LoadingSpinner";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [activeMenu, setActiveMenu] = useState("dashboard");
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
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

  const renderContent = () => {
    switch (activeMenu) {
      case "dashboard":
        return (
          <div className="p-4 md:p-6">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-gray-200">
              Welcome to Spa Message House
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
          </div>
        );
      case "messages":
        return <div className="p-4 md:p-6">Messages Content</div>;
      case "schedule":
        return <div className="p-4 md:p-6">Schedule Content</div>;
      case "clients":
        return <div className="p-4 md:p-6">Clients Content</div>;
      case "ai-agent":
        return (
          <div className="p-4 md:p-6">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-gray-200">
              AI Agent Dashboard
            </h2>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
              <div className="flex items-center mb-4">
                <AiOutlineRobot className="text-2xl text-indigo-600 dark:text-indigo-400 mr-3" />
                <h3 className="text-xl font-medium dark:text-gray-200">
                  Spa Message AI Assistant
                </h3>
              </div>
              <div className="space-y-4">
                <div className="p-4 bg-indigo-50 dark:bg-gray-700 rounded-lg">
                  <p className="font-medium dark:text-gray-200">
                    Current Status:{" "}
                    <span className="text-green-600 dark:text-green-400">
                      Active
                    </span>
                  </p>
                </div>
                <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors">
                  Start New Conversation
                </button>
              </div>
            </div>
          </div>
        );
      case "settings":
        return <div className="p-4 md:p-6">Settings Content</div>;
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
              Spa Message
            </h1>
          ) : (
            <h1
              className={`text-xl font-bold ${
                darkMode ? "text-indigo-400" : "text-indigo-600"
              }`}
            >
              SM
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
            onClick={() => setActiveMenu("clients")}
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
            <FiUsers className="text-lg" />
            {sidebarOpen && <span className="ml-3">Clients</span>}
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
              {/* Dark Mode Toggle Button in Header */}
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

              <div className="relative">
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs flex items-center justify-center rounded-full">
                  3
                </span>
                <button
                  className={`p-2 rounded-full ${
                    darkMode
                      ? "text-gray-400 hover:bg-gray-700"
                      : "text-gray-500 hover:bg-gray-100"
                  }`}
                >
                  <FiMessageSquare className="text-xl" />
                </button>
              </div>

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
