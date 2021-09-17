const models  = require('../models');
const utils   = require('../utils/webToken');
const fs      = require('fs');
const Post    = models.Post;
const User    = models.User;

// Créer un post
exports.create = (req, res, next) => {
    let attachmentLink  = "";
    let id              = utils.getUserId(req.headers.authorization);

    if (req.file) {
        attachmentLink = `${req.protocol}://${req.get('host')}/images/${req.file.filename}` 
    }

    const newPost = new Post({
        UserId: id,
        content: req.body.content,
        attachement: attachmentLink
    });

    newPost.save()
    .then(() => res.status(201).json({ message: "Post crée avec succès !"}))
    .catch(error => res.status(400).json({ error }));
};

// List des posts
exports.list = (req, res, next) => {
    Post.findAll({
        include: [{ model: models.User, attributes: ['username'] }],
        order: [['createdAt', 'DESC']]
    }).then(posts => {
        if (posts.length > null) {
            res.status(200).json(posts)
        } else {
            res.status(404).json({ error : 'Aucun post a afficher !' })
        }
    }).catch(err => res.status(500).json(err))
};

// Supprimer un post
exports.delete = (req, res, next) => {
    let userOrder   = req.body.userIdOrder;
    let id          = utils.getUserId(req.headers.authorization)

    User.findOne({ attributes: ['id', 'email', 'username', 'isAdmin'], where: { id: id }}).then(user => {
        if (user && (user.isAdmin == true || user.id == userOrder)) {
            Post.findOne({ where: { id: req.body.postId } }).then((postFind) => {
                if (postFind.attachement) {
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

    User.findOne({ attributes: ['id', 'email', 'username', 'isAdmin'], where: { id: id } }).then(user => {
        if (user && (user.isAdmin == true || user.id == userOrder)) {
            Post.update({ content: req.body.newText, attachement: req.body.newImg }, { where: { id: req.body.postId } })
            .then(() => res.end())
            .catch(err => res.status(500).json(err))
        } else {
            res.status(401).json({ error: 'Vous n\'avez pas les autorisations nécessaires' })
        }
    }).catch(error => res.status(500).json(error));
};
