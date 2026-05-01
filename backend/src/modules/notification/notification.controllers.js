import * as notificationService from "./notification.service.js";

export const createNotification = async (req, res, next) => {
    try {
        const notification = await notificationService.createNotification(req.body);
        res.status(201).json({
            success:true,
            message:"Notification created successfully",
            notification
        });
    } catch (error) {
        next(error);
    }
};

export const getMyNotifications = async (req, res, next) => {
    try {
        const notifications = await notificationService.getNotificationByUser(req.user.userId);
        res.status(200).json({
            success: true,
            message: "Notifications fetched successfully",
            data: notifications
        });
    } catch (err) {
        next(err);
    }
};

export const getNotification = async (req, res, next) => {
    try{
        const notification=await notificationService.getNotificationByUser(req.params.id);
        res.status(200).json({
            success:true,
            message:"Notifications fetched successfully",
            notification
        });
    }catch(er){
        next(er)
    }
}

export const markAsRead=async(req,res,next)=>{
    try{
        const notification=await notificationService.markAsRead(req.params.id);
        res.status(200).json({
            success:true,
            message:"Notification marked as read",
            notification
        })
    }catch(e){
        next(e)
    }
}