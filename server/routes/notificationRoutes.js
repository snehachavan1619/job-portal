const express = require("express");

const {
  getMyNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} = require("../controllers/notificationController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();


// Get my notifications
router.get(
  "/notifications",
  protect,
  getMyNotifications
);


// Mark one notification as read
router.put(
  "/notifications/:id/read",
  protect,
  markNotificationAsRead
);


// Mark all notifications as read
router.put(
  "/notifications/read-all",
  protect,
  markAllNotificationsAsRead
);


module.exports = router;