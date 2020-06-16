const jwt = require ('jsonwebtoken');

module.exports = {
    auth : (req, res, next) => {
        //console.log(req.method) = .get / .put / .pot / .patch / .delete
        if(req.method !== "OPTIONS") {
            //let success = true
            jwt.verify(req.token, "puripuriprisoner", (error, decoded) => { 
                if(error) {     //kalau tidak ada token
                    //success = false
                    return res.status(401).json({ message : "User not Authorized", error : "User not Authorized" })
                }
                console.log(decoded, 'ini decode')
                req.user = decoded;     //decoded = hasil decrypt dari token yang dikirim
                next();
            })
        }else{
            next();
        }
    }
}
