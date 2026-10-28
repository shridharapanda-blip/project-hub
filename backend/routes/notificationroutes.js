 const express = require("express");
const mongoose = require("mongoose");
const Notification = require("../models/notification");
const authMiddleware = require("../middleware/authmiddleware");

const router = express.Router();

// ========================================
// GET MY NOTIFICATIONS
// GET /api/notifications
// ========================================
router.get("/", authMiddleware, async (req, res) => {
try {
const notifications = await Notification.find({
recipient: req.user._id,
})
.populate("sender", "name profilePicture")
.sort({ createdAt: -1 })
.limit(100);

    const unreadCount = await Notification.countDocuments({
        recipient: req.user._id,
        isRead: false,
    });

    res.status(200).json({
        success: true,
        count: notifications.length,
        unreadCount,
        notifications,
    });
} catch (error) {
    console.error("Fetch notifications error:", error.message);

    res.status(500).json({
        success: false,
        message: "Unable to fetch notifications",
    });
}


});

// ========================================
// MARK ALL NOTIFICATIONS AS READ
// PATCH /api/notifications/read-all
// ========================================
router.patch("/read-all", authMiddleware, async (req, res) => {
try {
const result = await Notification.updateMany(
{
recipient: req.user._id,
isRead: false,
},
{
$set: { isRead: true },
}
);

    res.status(200).json({
        success: true,
        message: "All notifications marked as read",
        updatedCount: result.modifiedCount,
    });
} catch (error) {
    console.error("Mark all notifications error:", error.message);

    res.status(500).json({
        success: false,
        message: "Unable to update notifications",
    });
}

});

// ========================================
// MARK ONE NOTIFICATION AS READ
// PATCH /api/notifications/:id/read
// ========================================
router.patch("/:id/read", authMiddleware, async (req, res) => {
try {
const notificationId = req.params.id;

    if (!mongoose.isValidObjectId(notificationId)) {
        return res.status(400).json({
            success: false,
            message: "Invalid notification ID",
        });
    }

    const notification = await Notification.findOneAndUpdate(
        {
            _id: notificationId,
            recipient: req.user._id,
        },
        {
            $set: { isRead: true },
        },
        {
            new: true,
        }
    );

    if (!notification) {
        return res.status(404).json({
            success: false,
            message: "Notification not found",
        });
    }

    res.status(200).json({
        success: true,
        message: "Notification marked as read",
        notification,
    });
} catch (error) {
    console.error("Mark notification error:", error.message);

    res.status(500).json({
        success: false,
        message: "Unable to update notification",
    });
}

});

// ========================================
// DELETE ONE OF MY NOTIFICATIONS
// DELETE /api/notifications/:id
// ========================================
router.delete("/:id", authMiddleware, async (req, res) => {
try {
const notificationId = req.params.id;

    if (!mongoose.isValidObjectId(notificationId)) {
        return res.status(400).json({
            success: false,
            message: "Invalid notification ID",
        });
    }

    const notification = await Notification.findOneAndDelete({
        _id: notificationId,
        recipient: req.user._id,
    });

    if (!notification) {
        return res.status(404).json({
            success: false,
            message: "Notification not found",
        });
    }

    res.status(200).json({
        success: true,
        message: "Notification deleted successfully",
    });
} catch (error) {
    console.error("Delete notification error:", error.message);

    res.status(500).json({
        success: false,
        message: "Unable to delete notification",
    });
}

});

module.exports = router;
