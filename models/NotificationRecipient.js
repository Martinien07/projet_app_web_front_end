import { DataTypes } from "sequelize";
import database from "../config/connection.js";

const NotificationRecipient = database.define("NotificationRecipient", {
    notificationId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    recipientId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    isRead: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },

    readAt: {
    type: DataTypes.DATE
  },
});

export default NotificationRecipient;
