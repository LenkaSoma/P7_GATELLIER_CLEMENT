// Imports
const express   = require('express');
const router    = express.Router();
const userCtrl  = require('../controllers/user');
const auth      = require('../middleware/auth');

// Routage
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);
router.get('/profile', auth, userCtrl.profile);
router.put('/update',auth, userCtrl.changepassword);
router.delete('/delete', auth, userCtrl.deleteAccount);

module.exports = router;