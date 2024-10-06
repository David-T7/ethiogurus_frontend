import React, { useState, useEffect } from "react";
import { FaBell, FaEnvelope } from "react-icons/fa";
import axios from "axios";
import getRelativeTime from "../utils/getRelativeTime.js";
import SelectAppointmentDate from "./freealncerpage/SelectAppointmentDate.js";
import { useLocation, useNavigate } from "react-router-dom";

const NotificationPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [displayedNotifications, setDisplayedNotifications] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const notificationsPerPage = 5; // Show 5 notifications initially
  const [appointmentOptions, setAppointmentOptions] = useState([]); // State for appointment options
  const [appointmentID, setAppointmentID] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [appointmentDateSelected, setAppointmentDateSelected] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const token = localStorage.getItem("access");

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/api/user/notifications/",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const sortedNotifications = response.data.sort((a, b) => {
          if (a.read === b.read) {
            return new Date(b.timestamp) - new Date(a.timestamp);
          }
          return a.read - b.read;
        });
        setNotifications(sortedNotifications);
        setDisplayedNotifications(
          sortedNotifications.slice(0, notificationsPerPage)
        );
      } catch (error) {
        console.error("Error fetching notifications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const showMoreNotifications = () => {
    const nextPage = currentPage + 1;
    const startIndex = currentPage * notificationsPerPage;
    const newNotifications = notifications.slice(
      0,
      startIndex + notificationsPerPage
    );
    setDisplayedNotifications(newNotifications);
    setCurrentPage(nextPage);
  };
  const showLessNotifications = () => {
    setDisplayedNotifications(notifications.slice(0, notificationsPerPage)); // Reset to the initial batch
    setCurrentPage(1); // Reset page count
  };

  const markAsRead = async (id) => {
    try {
      // Update the state first, then make the API call
      const updatedNotifications = notifications.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      );

      setNotifications(updatedNotifications);
      setDisplayedNotifications(
        updatedNotifications.slice(0, currentPage * notificationsPerPage)
      );

      // Call the API to mark as read
      await axios.patch(
        `http://127.0.0.1:8000/api/user/notifications/${id}/`,
        { read: true },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const handleNotificationClick = async (notification) => {
    if (!appointmentDateSelected) {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/appointments/${notification.data.appointment_id}/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const isValidAppointmentDate = (dateString) => {
          const date = new Date(dateString);
          return date instanceof Date && !isNaN(date);
        };

        if (!isValidAppointmentDate(response.data.appointment_date)) {
          if (notification.type === "appointment_date_choice") {
            // Directly access appointment_date_options if already an object
            const appointmentDates = notification.data.appointment_date_options;
            setAppointmentOptions(appointmentDates); // Set the appointment options for the modal
            setAppointmentID(notification.data.appointment_id); // Set the appointment ID
            setIsModalOpen(true); // Open the modal
          } else {
            markAsRead(notification.id);
            navigate(location.pathname); // This will refresh the current route
          }
        } else {
          setAppointmentDateSelected(true);
        }
      } catch (error) {
        console.log("error fetching appointment");
      }
    }
    markAsRead(notification.id);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="bg-gray-100 min-h-screen p-4">
      <header className="text-center mb-8 mt-2">
        <p className="text-lg font-normal text-brand-dark-blue">
          Stay updated with your recent alerts and messages.
        </p>
      </header>

      {loading ? (
        <p className="text-center text-gray-600 py-8">
          Loading notifications...
        </p>
      ) : (
        <>
          {displayedNotifications.length === 0 ? (
            <p className="text-gray-600 text-center">No new notifications.</p>
          ) : (
            <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg border border-gray-200">
              <ul>
                {displayedNotifications.map((notification, index) => (
                  <React.Fragment key={notification.id}>
                    <li
                      className={`flex items-center justify-between py-4 px-6 cursor-pointer 
                        ${
                          notification.read
                            ? "bg-gray-50"
                            : "border-l-4 border-blue-500 shadow-lg"
                        }`}
                      onClick={() => handleNotificationClick(notification)}
                      style={
                        notification.read
                          ? {}
                          : { boxShadow: "0 0 10px rgba(0, 123, 255, 0.7)" }
                      }
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex-shrink-0">
                          {notification.type === "alert" ? (
                            <FaBell
                              className={`text-2xl ${
                                notification.read
                                  ? "text-yellow-600"
                                  : "text-blue-600 animate-bounce"
                              }`}
                            />
                          ) : (
                            <FaEnvelope
                              className={`text-2xl ${
                                notification.read
                                  ? "text-blue-600"
                                  : "text-blue-600 animate-pulse"
                              }`}
                            />
                          )}
                        </div>
                        <div>
                          <h3
                            className={`text-xl font-normal ${
                              notification.read
                                ? "text-gray-800"
                                : "text-blue-800"
                            }`}
                          >
                            {notification.title}
                          </h3>
                          <p className="text-gray-600">
                            {notification.description}
                          </p>
                          <span className="text-gray-500 text-sm">
                            {getRelativeTime(notification.timestamp)}
                          </span>
                        </div>
                      </div>
                      {!notification.read && (
                        <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                          New
                        </span>
                      )}
                    </li>
                    {index < displayedNotifications.length - 1 && (
                      <hr className="border-t border-gray-300" />
                    )}
                  </React.Fragment>
                ))}
              </ul>
              {displayedNotifications.length < notifications.length && (
                <div className="text-center py-4">
                  <button
                    onClick={showMoreNotifications}
                    className="text-blue-600 hover:text-blue-800 underline"
                  >
                    Show More
                  </button>
                </div>
              )}
              { notifications.length === displayedNotifications.length && displayedNotifications.length > notificationsPerPage && (
                <div className="text-center py-4">
                  <button
                    onClick={showLessNotifications}
                    className="text-blue-600 hover:text-blue-800 underline"
                  >
                    Show Less
                  </button>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* Modal for selecting appointment dates */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <SelectAppointmentDate
            appointmentOptions={appointmentOptions}
            appointmentID={appointmentID}
            setAppointmentDateSelected={setAppointmentDateSelected}
            onClose={closeModal}
          />
        </div>
      )}
    </div>
  );
};

export default NotificationPage;
