// This is the Chantier model

import database from "../config/connection.js"
import { DataTypes } from "sequelize"

const Chantier=database.define('Chantier',{
    name:{
        type:DataTypes.STRING,
        allowNull:false
    },
    location:{
        type:DataTypes.STRING,
        allowNull:false
    },
    description:{
        type:DataTypes.TEXT,
    },
    startDate:{
        type:DataTypes.DATE,
        allowNull:false
    },
    endDate:{
        type:DataTypes.DATE,
        allowNull:false
    },
    status:{
        type:DataTypes.ENUM('en_cours','termine','en_pause'),
        defaultValue:'en_cours'
    },
    createdAt:{
        type:DataTypes.DATE,
    },
    updatedAt:{
        type:DataTypes.DATE,
    }
});

export default Chantier;
