// models/Inspection.js
import { DataTypes } from 'sequelize';
import database from '../config/connection.js';

const Inspection = database.define(
  'Inspection',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    chantierId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    inspectorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('conforme', 'non_conforme', 'en_attente'),
      allowNull: false,
      defaultValue: 'en_attente',
    },
    observation: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    recommendations: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: 'Inspections',
    timestamps: true, // gère createdAt / updatedAt automatiquement
  }
);

export default Inspection;
