const jsontoken = require('jsonwebtoken'); // On récupère le package qui permet de vérifier un token

// Middleware pour sécuriser les routes
module.exports = (req, res, next) => {
    try {
        const token  = req.headers.authorization.split(' ')[1];         // On récupère le token dans le header de la requête et uniquement le deuxième élement (split)
        const decode = jsontoken.verify(token, 'RANDOM_TOKEN_SECRET');  // On vérifie le token récupéré avec la clé secrète pour qu'elles correspondent
        const userId = decode.userId;                                   // On vérifie que l'userId correspond a celui envoyé dans le token

        // S'ils ne correspondent pas, envoie une erreur, sinon passe le middleware
        if (req.body.userId && req.body.userId !== userId) {
            throw 'UserID incorrect'; // Erreur
        } else {
            next(); // OK, il passe le middleware
        }
    } catch(error) {
        res.status(401).json({ error: 'La requête a échouée' }) // Erreur si problème d'authenficiation
    }
};