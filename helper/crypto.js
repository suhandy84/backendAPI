const crypto=require('crypto')

module.exports=(password)=>{
    return crypto.createHmac('sha256','puripuri').update(password).digest('hex') //'sh256' merupakan tipe algoritma yang dipakai, 'puripuri' merupakan kunci untuk pola encrypt]
}