import React, { createContext, useContext, useState, useCallback } from "react";
import { apiRequest } from "../utils/api";

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotifications must be used within a NotificationProvider");
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  // Fetch unread notification count
  const fetchUnreadCount = useCallback(async () => {
    if (!token) return;
    
    try {
      const response = await apiRequest("GET", "/notifications/unread-count", null, {
        Authorization: `Bearer ${token}`,
      });
      
      if (response.data?.status) {
        setUnreadCount(response.data.count || 0);
      }
    } catch (error) {
      console.error("Failed to fetch unread count:", error);
    }
  }, [token]);

  // Fetch all notifications
  const fetchNotifications = useCallback(async () => {
    if (!token) return;
    
    setLoading(true);
    try {
      const response = await apiRequest("GET", "/notifications", null, {
        Authorization: `Bearer ${token}`,
      });
      
      if (response.data?.status) {
        setNotifications(response.data.data || []);
        setUnreadCount(response.data.unread_count || 0);
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Mark a single notification as read
  const markAsRead = useCallback(async (notificationId) => {
    if (!token) return;
    
    try {
      const response = await apiRequest("POST", `/notifications/${notificationId}/read`, null, {
        Authorization: `Bearer ${token}`,
      });
      
      if (response.data?.status) {
        setUnreadCount(response.data.unread_count || 0);
        // Update local notification state
        setNotifications(prev => 
          prev.map(n => 
            n.id === notificationId 
              ? { ...n, read_at: new Date().toISOString() }
              : n
          )
        );
      }
      return response.data;
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
      return null;
    }
  }, [token]);

  // Mark all notifications as read
  const markAllAsRead = useCallback(async () => {
    if (!token) return;
    
    try {
      const response = await apiRequest("POST", "/notifications/read-all", null, {
        Authorization: `Bearer ${token}`,
      });
      
      if (response.data?.status) {
        setUnreadCount(0);
        // Update local notification state
        setNotifications(prev => 
          prev.map(n => ({ ...n, read_at: n.read_at || new Date().toISOString() }))
        );
      }
      return response.data;
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
      return null;
    }
  }, [token]);

  // Update count from dashboard data (to avoid extra API call)
  const setCountFromDashboard = useCallback((count) => {
    setUnreadCount(count || 0);
  }, []);

  // Update notifications from dashboard data
  const setNotificationsFromDashboard = useCallback((notifs, count) => {
    setNotifications(notifs || []);
    setUnreadCount(count || 0);
  }, []);

  const value = {
    unreadCount,
    notifications,
    loading,
    fetchUnreadCount,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    setCountFromDashboard,
    setNotificationsFromDashboard,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationContext;
