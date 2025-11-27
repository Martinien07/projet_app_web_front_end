import bcrypt from "bcrypt";
import database from "../config/connection.js"
import { DataTypes } from "sequelize"  

//Definition du modele Assignment
/**Table : Assignments (liaison User–Chantier–Rôle)

Champ	Type
id	INTEGER
userId	INTEGER
chantierId	INTEGER
roleId	INTEGER
assignedAt	DATE
isActive	BOOLEAN
**/

const Assignment=database.define('Assignment',{
    userId:{
        type:DataTypes.INTEGER,
        allowNull:false,
    },
    chantierId:{
        type:DataTypes.INTEGER,
        allowNull:false,
    },
    roleId:{
        type:DataTypes.INTEGER,
        allowNull:false,
    },
    assignedAt:{
        type:DataTypes.DATE,
        defaultValue:DataTypes.NOW
    },
    isActive:{
        type:DataTypes.BOOLEAN,
        defaultValue:true
    }
},
{timestamps:true}
)
export default Assignment;






