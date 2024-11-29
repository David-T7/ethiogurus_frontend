import React, { useEffect, useState } from "react";
import { FaBell, FaEnvelope } from "react-icons/fa";
import { useQuery, useMutation } from "@tanstack/react-query";
import axios from "axios";
import getRelativeTime from "../utils/getRelativeTime.js";
import SelectAppointmentDate from "./freealncerpage/SelectAppointmentDate.js";
import { useLocation, useNavigate } from "react-router-dom";

const fetchNotifications = async () => {
  const token = localStorage.getItem("access");
  const response = await axios.get("http://127.0.0.1:8000/api/user/notifications/", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const sortedNotifications = response.data.sort((a, b) => {
    if (a.read === b.read) {
      return new Date(b.timestamp) - new Date(a.timestamp);
    }
    return a.read - b.read;
  });
  return sortedNotifications;
};

const markNotificationAsRead = async (id) => {
  const token = localStorage.getItem("access");
  await axios.patch(
    `http://127.0.0.1:8000/api/user/notifications/${id}/`,
    { read: true },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

const NotificationPage = () => {
  const notificationsPerPage = 5;
  const [displayedNotifications, setDisplayedNotifications] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [appointmentOptions, setAppointmentOptions] = useState([]);
  const [appointmentID, setAppointmentID] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [appointmentDateSelected, setAppointmentDateSelected] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  // Fetch notifications using useQuery
  const { data: notifications = [], isLoading, isError, error } = useQuery({
    queryKey: ["notifications"],
    queryFn: fetchNotifications,
  });

  useEffect(() => {
    if(notifications){
    setDisplayedNotifications(notifications.slice(0, notificationsPerPage));
    }
  },[notifications])

  // Mutation to mark notifications as read
  const markAsReadMutation = useMutation({
    mutationFn: markNotificationAsRead,
    onSuccess: () => {
      // Optionally refetch notifications or update local state
    },
  });

  const showMoreNotifications = () => {
    const nextPage = currentPage + 1;
    const startIndex = currentPage * notificationsPerPage;
    const newNotifications = notifications.slice(0, startIndex + notificationsPerPage);
    setDisplayedNotifications(newNotifications);
    setCurrentPage(nextPage);
  };

  const showLessNotifications = () => {
    setDisplayedNotifications(notifications.slice(0, notificationsPerPage));
    setCurrentPage(1);
  };

  const handleNotificationClick = async (notification) => {
    if (!appointmentDateSelected) {
      try {
        const token = localStorage.getItem("access");
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
            const appointmentDates = notification.data.appointment_date_options;
            setAppointmentOptions(appointmentDates);
            setAppointmentID(notification.data.appointment_id);
            setIsModalOpen(true);
          } else {
            markAsReadMutation.mutate(notification.id);
            navigate(location.pathname);
          }
        } else {
          setAppointmentDateSelected(true);
        }
      } catch (error) {
        console.error("Error fetching appointment:", error);
      }
    }
    markAsReadMutation.mutate(notification.id);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  if (isLoading) return <p className="text-center text-gray-600 py-8">Loading notifications...</p>;
  if (isError) return <p className="text-center text-red-600">Error: {error.message}</p>;

  return (
    <div className="bg-gray-100 min-h-screen p-4">
      <header className="text-center mb-8 mt-2">
        <p className="text-lg font-normal text-brand-dark-blue">
          Stay updated with your recent alerts and messages.
        </p>
      </header>

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
                        className={`text-lg font-normal ${
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
          {notifications.length === displayedNotifications.length &&
            displayedNotifications.length > notificationsPerPage && (
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
