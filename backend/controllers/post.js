let models  = require('../models');
let utils   = require('../utils/webToken');
const fs    = require('fs');

// Créer un post
exports.create = (req, res) => {
    // A faire
};

// List des posts
exports.list = (req, res) => {
    models.Post.findAll({
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
exports.delete = (req, res) => {
   // A faire
};

// Mettre a jour un post
exports.update = (req, res) => {
    // A faire
};
