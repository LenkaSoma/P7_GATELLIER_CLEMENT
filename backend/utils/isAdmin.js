let bcrypt      = require('bcrypt');
let webtoken    = require('jsonwebtoken');
let models      = require('../models');

module.exports ={
    isAdmin:function(user) { return true }
}