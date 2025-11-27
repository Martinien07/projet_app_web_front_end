// models/Incident.js

import database from "../config/connection.js"
import { DataTypes } from 'sequelize';


const Incident = database.define('Incident', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    chantierId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
        model: 'chantiers',
        key: 'id'
        }
    },
    reportedBy: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
        model: 'users',
        key: 'id'
        }
    },
    title: {
        type: DataTypes.STRING(200),
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    severity: {
        type: DataTypes.ENUM('mineur', 'modéré', 'critique'),
        defaultValue: 'mineur',
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('ouvert', 'en_cours', 'résolu'),
        defaultValue: 'ouvert',
        allowNull: false
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    photo: {
        type: DataTypes.STRING(500),
        allowNull: true
    },
    createdAt: {
        type: DataTypes.DATE,
    },
    updatedAt: {
        type: DataTypes.DATE,
    }
});

export default Incident;