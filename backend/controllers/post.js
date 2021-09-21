// Importations
const models  = require('../models');
const utils   = require('../utils/webToken');
const fs      = require('fs');
const Post    = models.Post;
const User    = models.User;

// Créer un post
exports.create = (req, res, next) => {
    let attachmentLink  = "";
    let id              = utils.getUserId(req.headers.authorization);

    // Si un fichier est joint on récupère le lien direct de l'image
    if (req.file) { attachmentLink = `${req.protocol}://${req.get('host')}/images/${req.file.filename}` }

    // On crée un nouveau post puis on le sauvegarde en base de données
    const newPost = new Post({ UserId: id, content: req.body.content, attachement: attachmentLink });
    newPost.save()
    .then(() => res.status(201).json({ message: "Post crée avec succès !"}))
    .catch(error => res.status(400).json({ error }));
};

// List des posts
exports.list = (req, res, next) => {
    // On recherche tous les ports triés par la date de création
    Post.findAll({ include: [{ model: models.User, attributes: ['username'] }], order: [['createdAt', 'DESC']] }).then(posts => {
        if (posts.length > null) {
            res.status(200).json(posts)
        } else {
            // Si aucun post trouvé, renvoie une erreur 404
            res.status(404).json({ error : 'Aucun post a afficher !' })
        }
    }).catch(err => res.status(500).json(err))
};

// Supprimer un post
exports.delete = (req, res, next) => {
    let userOrder   = req.body.userIdOrder;
    let id          = utils.getUserId(req.headers.authorization)

    // On recherche l'utilisateur correspond a l'ID envoyé
    User.findOne({ attributes: ['id', 'email', 'username', 'isAdmin'], where: { id: id }}).then(user => {
        if (user && (user.isAdmin == true || user.id == userOrder)) {
            // On cherche le post correspondant a l'utilisateur
            Post.findOne({ where: { id: req.body.postId } }).then((postFind) => {
                if (postFind.attachement) {
                    // S'il y a une image a ce post
                    const filename = postFind.attachement.split('/images/')[1];
                    fs.unlink(`images/${filename}`, () => {
                        Post.destroy({ where: { id: postFind.id } })
                        .then(() => res.end())
                        .catch(err => res.status(500).json(err))
                    })
                } else {
                    Post.destroy({ where: { id: postFind.id } })
                    .then(() => res.end())
                    .catch(err => res.status(500).json(err))
                }
            }).catch(err => res.status(500).json(err))
        } else { 
            res.status(403).json('Vous n\'avez pas les autorisations nécessaires') 
        }
    }).catch(error => res.status(500).json(error));
};

// Mettre a jour un post
exports.update = (req, res, next) => {
    let userOrder   = req.body.userIdOrder;
    let id          = utils.getUserId(req.headers.authorization);

    // On recherche l'utilisateur correspondant a l'ID
    User.findOne({ attributes: ['id', 'email', 'username', 'isAdmin'], where: { id: id } }).then(user => {
        if (user && (user.isAdmin == true || user.id == userOrder)) {
            // On met a jour le post avec les nouvelles informations
            Post.update({ content: req.body.newText, attachement: req.body.newImg }, { where: { id: req.body.postId } })
            .then(() => res.end())
            .catch(err => res.status(500).json(err))
        } else {
            res.status(401).json({ error: 'Vous n\'avez pas les autorisations nécessaires' })
        }
    }).catch(error => res.status(500).json(error));
};
