const nodemailer=require('nodemailer')

let transporter=nodemailer.createTransport({
    service:'gmail',
    auth:{
        user:'suhandy4.24@gmail.com',    //email masing2
        pass:'stkqlgdmnyubbtvb'         //password yang diberikan dari nodemailer
    },
    tls:{
        rejectUnauthorized:false
    }
})

module.exports=transporter