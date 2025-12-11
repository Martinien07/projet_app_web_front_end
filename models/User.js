import bcrypt from "bcrypt";
import database from "../config/connection.js";
import { DataTypes } from "sequelize";

const User = database.define(
  "User",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },

    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    status: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },

    access: {
      type: DataTypes.INTEGER,
      defaultValue: 0, // 0 = user, 1 = admin
    },
  },

  {
    timestamps: true,

    indexes: [
      {
        unique: true,
        fields: ["email"],   // IMPORTANT : index stable pour MySQL
        name: "unique_email", // Nom explicite, évite doublons
      },
    ],

    hooks: {
      /** Hash avant création */
      beforeCreate: async (user) => {
        if (user.password) {
          user.password = await bcrypt.hash(user.password, 10);
        }
      },

      /** Hash avant update */
      beforeUpdate: async (user) => {
        if (user.changed("password")) {
          user.password = await bcrypt.hash(user.password, 10);
        }
      },
    },
  }
);

export default User;
