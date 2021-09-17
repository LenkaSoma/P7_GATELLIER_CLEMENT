const bcrypt      = require('bcrypt');
const jsontoken   = require('jsonwebtoken');
const models      = require('../models');
const utils       = require('../utils/webToken');
const checkInput  = require('../utils/checkInputs');
const User        = models.User;
const Post        = models.Post;

// Créer un nouvel utilisateur
exports.signup = (req, res, next) => {
    if (req.body.username && req.body.email && req.body.password) {
       bcrypt.hash(req.body.password, 10).then(hash => {
           const user = new User({
               username: req.body.username,
               email: req.body.email,
               password: hash,
               isAdmin: false
           });

           user.save().then((user) => {
               if (user) { return res.status(201).json({ message: 'Utilisateur crée avec succès !'}) }
           }).catch((error) => {res.status(401).json({error})});
       }).catch((error) => {res.status(500).json({error})});
    } else {
        return res.status(400).json({ message: "Veuillez remplir tous les champs" })
    }
};

// Connexion
exports.login = (req, res, next) => {
    if (req.body.username && req.body.password) {
        User.findOne({ where: { username: req.body.username }})
        .then(user => {
            if (user) {
                bcrypt.compare(req.body.password, user.password).then(valid => {
                    if (!valid) {
                        return res.status(401).json({ message: "Mot de passe incorrect" });
                    } else {
                        res.status(200).json({
                            message:    "Connexion réussie",
                            userId:     user.id,
                            role:       user.isAdmin,
                            userName :  user.userName,
                            token:      jsontoken.sign( { userId: user.id }, 'RANDOM_TOKEN_SECRET', { expiresIn: '24h' } )
                        })
                    }
                })
            } else {
                res.status(404).json({ 'erreur': 'Utilisateur introuvable !' })
            }
        }).catch(err => { res.status(500).json({ err }) })
    } else {
        res.status(400).json({ error: 'Veuillez remplir les champs indiqués' })
    }
};

// Profil de l'utilisateur
exports.profile = (req, res, next) => {
    let id = utils.getUserId(req.headers.authorization)
    User.findOne({ attributes: ['id', 'email', 'username', 'isAdmin'], where: { id: id } })
    .then(user => res.status(200).json(user))
    .catch(error => res.status(500).json(error))
};

// Changer de mot de passe
exports.changepassword = (req, res, next) => {
    let userId          = utils.getUserId(req.headers.authorization);
    const newPassword   = req.body.newPassword;

    if (checkInput.validPassword(newPassword)) {
        User.findOne({ where: { id: userId } })
        .then(user => {
            bcrypt.compare(newPassword, user.password, (errComparePassword, resComparePassword) => {
                if (resComparePassword) {
                    res.status(406).json({ error: 'Vous avez entrer un mot de passe identique' })
                } else {
                    bcrypt.hash(newPassword, 10, function (err, bcryptNewPassword) {
                        User.update({ password: bcryptNewPassword }, { where: { id: user.id }})
                        .then(() => res.status(201).json({ confirmation: 'Mot de passe modifié avec succès' }))
                        .catch(err => res.status(500).json(err))
                    })
                }
            })
        }).catch(err => json(err))
    } else {
        res.status(406).json({ error: 'Mot de passe invalide !' })
    }
};

// Supprimer le compte
exports.deleteAccount = (req, res, next) => {
    let userId = utils.getUserId(req.headers.authorization);

    if (userId != null) {
        User.findOne({ where: { id: userId } })
        .then(user => {
            if (user != null) {
                Post.destroy({ where: { userId: user.id } })
                .then(() => {
                    console.log('Tous les posts de cet utilisateur ont été supprimés !');
                    User.destroy({ where: { id: user.id } })
                    .then(() => res.end())
                    .catch(err => console.log(err))
                }).catch(err => res.status(500).json(err))
            } else {
                res.status(401).json({ error: 'Cet utilisateur n\'existe pas' })
            }
        })
    } else {
        res.status(500).json({ error: 'Impossible de supprimer ce compte, veuillez réessayer !' })
    }
};