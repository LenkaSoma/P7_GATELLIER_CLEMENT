let webtoken = require('jsonwebtoken')

module.exports = {
  tokenSign : 'RANDOM_TOKEN_SECRET',
  generateToken: function (user) {
    return webtoken.sign({
      userId: user.id,
      isAdmin: user.isAdmin
    },
      this.tokenSign,
      {
        expiresIn: '24h'
      })
  },
  getUserId: function (data) {
    if (data.length > 1) {
      let token = data.split(' ')[1];
      try {
        let decodedToken = webtoken.verify(token, this.tokenSign)
        userId = decodedToken.userId
        return userId
      }
      catch(err) { return err }
    };
  }
}