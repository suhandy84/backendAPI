const jwt=require('jsonwebtoken');

module.exports = {
    createJWTToken(payload) {
        return jwt.sign(payload, "puripuriprisoner", { expiresIn : '12h'}) //payload dalam bentuk object
    }
}

//'12h' itu waktu kadaluarsanya yaitu 12 jam
//defaultnya pakai milisecond
