const express   = require('express');   // Import d'express
const path      = require('path');      // Import de path pour upload des images et gérer les fichiers
const helmet    = require('helmet');    // Import d'Helmet pour améliorer la sécurité de l'application
const app       = express();

// Gestion CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());                                                // Transforme les données POST en objet JSON
app.use(helmet());                                                      // Mise en place du X-XSS-Protection / Sécurité
app.use('/images', express.static(path.join(__dirname, 'images')));     // Permet de charger les fichiers dans le dossier images

module.exports = app;