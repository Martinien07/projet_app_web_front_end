import bcrypt from "bcrypt";
import database from "../config/connection.js"
import { DataTypes } from "sequelize"  

//Definition du modele User
//Table users

//But : gérer les comptes utilisateurs (maître d’œuvre, sous-traitants, inspecteurs, etc.)

/**id	INTEGER
id	INTEGER
name	ENUM('superviseur','ouvrier','responsable','collaborateur', 'employe')
description	STRING
**/

const Role=database.define('Role',{
    name:{
        type:DataTypes.STRING,
        allowNull:false,
        unique:true
        
    },          
    description:{
        type:DataTypes.STRING,
        allowNull:false,
        //unique:true,
    }
    

},


{timestamps:true}

)    
        
export default Role;








