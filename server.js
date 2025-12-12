import express from 'express';
import compression from 'compression';
import helmet from 'helmet';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from "dotenv";
import methodOverride from 'method-override';

dotenv.config();




import database from './config/connection.js';
import userRoutes from './routes/userRoutes.js';
import assignmentRoutes from './routes/assignmentRoutes.js';
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import chantierRoutes from './routes/chantierRoutes.js';
import incidentRoutes from './routes/incidentRoutes.js';
import inspectionRoutes from './routes/inspectionRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import roleRoutes from './routes/roleRoutes.js';
import viewRoutes from "./routes/viewsRoutes.js";
import session from "express-session";




// Définir __dirname en mode ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



// console.log("Lancement du serveur...",dotenv.config());

//Definir le serveur
const app = express();
const PORT = process.env.PORT || 8000;

//Ajouter les middlewares a express
app.use(helmet())
app.use(cors());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//tromper” Express avec un middleware
app.use(methodOverride('_method'));



app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { 
        maxAge: 1000 * 60 * 60 * 24 // 24h
    }
}));




//Utilisation de ejs comme moteur de rendu
app.set('view engine', 'ejs');
app.set('views', './views');
app.use("/", viewRoutes);
// Servir les fichiers statiques depuis le dossier assets
app.use('/assets', express.static(path.join(__dirname, './views/assets')));

app.use(express.static('public')) //Permet d'acceder aux fichiers statiques sans le /public dans l'url



//Creation des tables
//database.sync({ alter: true })


//gestion des sessions utilisateurs




//Route de test
app.get('/', (req, res) => {
    res.render('index')
});

//Route pour les utilisateurs à partir de userRoutes.js
// app.use('/api/as', userRoutes);

//Route pour les inspections
app.use('/api/inspection', inspectionRoutes);


//Route pour les assignement à partir de assignmentRoutes.js
app.use('/api/assignment', assignmentRoutes);

//Route pour les utilisateurs à partir de userRoutes.js
app.use('/users', userRoutes);

//Route pour les utilisateurs à partir de userRoutes.js
app.use('/api/notification', notificationRoutes);

//Route pour l'authentification à partir de authRoutes.js
app.use('/auth', authRoutes);

//Route pour les actions admin à partir de adminRoutes.js
app.use('/api/admin', adminRoutes);


// Route pour les chantiers à partir de chantierRoutes.js
app.use('/api/chantiers', chantierRoutes);

// Route pour les incidents à partir de incidentRoutes.js
app.use('/api/incidents', incidentRoutes);


//Route pour les roles à partir de roleRoutes.js
app.use('/api/role', roleRoutes );


//Demarrer le serveur
app.listen(PORT, () => {
    console.log(`Le serveur a demarre sur le port ${PORT}`);
});
