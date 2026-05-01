import Notification from "./notification.model.js";
import User from "../users/user.model.js";
import { sendEmail } from "../../utils/email.js";

const buildError = (message, statusCode) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

export const createNotification = async (data) => {
  const { recipient, type, title, message, channels, metadata } = data;
  
  if (!recipient) throw buildError("Recipient is required.", 400);
  if (!type) throw buildError("Type is required.", 400);
  if (!title) throw buildError("Title is required.", 400);
  if (!message) throw buildError("Message is required.", 400);

  // 1. Handle In-App Notification (Save to DB)
  let notification = null;
  if (!channels || channels.inApp !== false) {
    notification = await Notification.create({
      recipient,
      type,
      title,
      message,
      channels: channels || { inApp: true, email: false },
      metadata,
    });
  }

  // 2. Handle Email Notification
  if (channels && channels.email === true) {
    try {
      const user = await User.findById(recipient);
      if (user && user.email) {
        await sendEmail({
          to: user.email,
          subject: title,
          text: message,
          html: `<p>${message}</p>`,
        });
      }
    } catch (emailError) {
      console.error("Email delivery failed:", emailError.message);
      // We don't throw here so the in-app notification still works
    }
  }

  return notification;
};

export const getNotificationByUser = async (userId) => {
  if (!userId) throw buildError("User ID is required.", 400);
  
  return await Notification.find({ recipient: userId })
    .sort({ createdAt: -1 });
};

export const markAsRead = async (notificationId) => {
  if (!notificationId) throw buildError("Notification ID is required.", 400);

  const notification = await Notification.findByIdAndUpdate(
    notificationId,
    { is_read: true },
    { returnDocument: 'after' }
  );

  if (!notification) throw buildError("Notification not found.", 404);
  
  return notification;
};