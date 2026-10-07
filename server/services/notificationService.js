const Notification = require("../models/Notification");

const createNotification = async ({
  userId,
  title,
  message,
  type = "GENERAL",
}) => {
  try {
    const notification = await Notification.create({
      user_id: userId,
      title,
      message,
      type,
      is_read: false,
    });

    return notification;
  } catch (error) {
    console.error("Notification creation error:", error);
    return null;
  }
};

module.exports = {
  createNotification,
};