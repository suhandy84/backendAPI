const {db} = require('../connections');
const {createJWTToken} = require('../helper/jwt');
const transporter = require('../helper/mailer');
const encrypt = require('../helper/crypto');

module.exports={
    userregister:(req,res)=>{
        const {username, password, email} = req.body
        const hashpass = encrypt(password)
        var sql=`select * from users where username='${username}'`   //cek username ada atau tidak
        db.query(sql, (err,result)=>{
            if(err) return res.status(500).send(err)    //kalau sqlnya error maka send err
            if(result.length) {
                console.log('username sudah dipakai')
                return res.status(200).send({status : false, message :'username sudah dipakai'})    //kalau usernamenya sudah ada maka harus pakai yang lain untuk usernamenya              
            }else{
                console.log('lewat')
                sql=`insert into users set ?`   //kalau usernamenya tidak ada maka user berhasil register, masukkan data ke dalam database
                var data={
                    username:username,
                    password:hashpass,   //password yang di input ke database berupa password yang sudah di encrypt
                    email,               //penulisannya sama dengan email:email
                    lastlogin: new Date()            
                }
                db.query(sql,data,(req,result2)=>{
                    if(err) return res.status(500).send(err)    //kalau sqlnya error maka send err
                    //setelah itu kirimkan link email verifikasi
                    const token=createJWTToken({id:result2.insertId, username:username})    //buat token untuk dikirm ke front-end
                    var linkVerification=`http://localhost:3000/verified?token=${token}` //link halaman frontend 'id' sama dengan yang di database
                    transporter.sendMail({
                        from:'testing <suhandy4.24@gmail.com>',
                        to:email,
                        subject:'Testing email',
                        html:`<div style="height:50vh; display:flexbox; justify-content:center; align-items:center;">
                                <div style="display:flexbox; justify-content:center; align-items:flex-start; flex-direction:column; width:30%; border:2px solid #281e5a; border-radius:10px; height:200px; padding-left:10px;padding-right:10px; ">
                                    <h1 style="color:#281e5a; text-align:left; font-weight:bold; ">Verify Your Email</h1>
                                    <h4 style="color:#281e5a; text-align:left; ">Hi ${username} ! use the link below to verify your email and start enjoying bookstore</h4>                   
                                    <div  style="display:flexbox; justify-content:center; align-items:center; width:100%; margin-top:15px;">
                                        <a href='${linkVerification}' >
                                            <button style="background-color: #281e5a; color: white; width: 100%; border: none; border-radius: 5px; height:30px" href='/' >Verify Email</button>
                                        </a>
                                    </div>
                                </div>
                            </div>`,
                    },(err, result3)=>{
                        if(err) return res.status(500).send(err)    //kalau sqlnya error maka send err
                        sql=`select * from users where iduser=${result2.insertId}`
                        db.query(sql,(err,result4)=>{
                            if(err) return res.status(500).send(err)    //kalau sqlnya error maka send err
                            // const token=createJWTToken({id:result4[0].id, username:result4[0].username})    //buat token untuk dikirm ke front-end
                            return res.status(200).send({...result4[0], token, status:true})     //akan menjadi res.data di front end
                        })  
                    })
                })
            }

        })
    },

    userlogin:(req, res)=>{
        const {username, password}=req.query
        const hashpass = encrypt(password)
        var sql=`select * from users where (username = '${username}' or email = '${username}') and password = '${hashpass}'`
        db.query(sql, (err,result)=>{
            if(err) return res.status(500).send(err)
            if(result.length) {
                console.log(result)
                var data = {
                    lastlogin: new Date()            
                }
                sql = `update users set ? where iduser=${result[0].iduser}`
                db.query(sql, data, (err2, res2)=>{
                    if(err2) return res.status(500).send(err2)
                    console.log(result[0].iduser)                         //jika user ada
                    const token=createJWTToken({id:result[0].iduser, username:result[0].username})    //buat token
                    return res.status(200).send({...result[0], token:token, status:true})    //kirim result dari database beserta token ke front-end berupa objek
                })
            }else{
                sql=`select * from users where username = '${username}' or email = '${username}'`
                db.query(sql, (err3, res3)=>{
                    if(err3) return res.status(500).send(err3)
                    if(res3.length) {
                        return res.status(200).send({status : false, message : 'passsword salah'})
                    }else{
                        return res.status(200).send({status : false, message : 'username / email salah'})
                    }
                })
            }
        })

    },

    userverified:(req, res) => {
        console.log(req.user, 'ini req.user')
        const {id} = req.user
        var obj={
            isverified:1
        }
        var sql = `update users set ? where iduser=${id}`
        db.query(sql, obj,(err,res1)=>{
            if(err) return res.status(500).send(err)
            sql=`select * from users where iduser=${id}`
            db.query(sql,(err,res2)=>{
                if(err) return res.status(500).send(err)
                return res.status(200).send(res2[0])
            })  
        })
    },

    sendmailverified:(req, res) => {
        const {iduser, username} = req.body
        const token=createJWTToken({id:iduser, username:username})    //buat token untuk dikirm ke front-end
        var linkVerification=`http://localhost:3000/verified?${token}` //link halaman frontend 'id' sama dengan yang di database
        transporter.sendMail({
            from:'testing <suhandy4.24@gmail.com>',
            to:email,
            subject:'Testing email',
            html:`Tolong klik link berikut untuk verifikasi :
            <a href=${linkVerification}> Verification<a/>`,
        },(err, result3)=>{
            if(err) return res.status(500).send(err)    //kalau sqlnya error maka send err
            return res.status(200).send({status:true})
        })
    },

    keeplogin:(req,res) => {
        console.log(req.user)
        var sql = `select * from users where iduser=${req.user.id}`
        db.query(sql, (err,res1)=>{
            if(err) return res.status(500).send(err)
            // console.log(res1, 'ini res1')
            const token=createJWTToken({id:res1[0].iduser, username:res1[0].username})    //buat token
            return res.status(200).send({...res1[0], token:token})
        })
    },

    sendmailforgotpassword:(req, res) => {
        const {email} = req.body
        const token=createJWTToken({email:email})    //buat token untuk dikirm ke front-end
        var linkVerification=`http://localhost:3000/resetpassword?token=${token}` //link halaman frontend 'id' sama dengan yang di database
        transporter.sendMail({
            from:'testing <suhandy4.24@gmail.com>',
            to:email,
            subject:'Forgot Password',
            html:`<div style="height:50vh; display:flexbox; justify-content:center; align-items:center;">
                        <div style="display:flexbox; justify-content:center; align-items:flex-start; flex-direction:column; width:30%; border:2px solid #281e5a; border-radius:10px; height:200px; padding-left:10px;padding-right:10px; ">
                            <h1 style="color:#281e5a; text-align:left; font-weight:bold; ">Forgot Your Password</h1>
                            <h4 style="color:#281e5a; text-align:left; ">Please use the link below to forgot your password</h4>                   
                            <div  style="display:flexbox; justify-content:center; align-items:center; width:100%; margin-top:15px;">
                                <a href='${linkVerification}' >
                                    <button style="background-color: #281e5a; color: white; width: 100%; border: none; border-radius: 5px; height:30px" href='/' >Verify Email</button>
                                </a>
                            </div>
                        </div>
                    </div>`,
        },(err, result3)=>{
            if(err) return res.status(500).send(err)    //kalau sqlnya error maka send err
            return res.status(200).send({status:true})
        })
    },

    forgotpasswordverified:(req, res) => {
        console.log(req.user, 'ini req.user')
        const {email} = req.user
        return res.status(200).send(email)
    },
    
    resetpassword:(req, res) => {
        console.log(req.body, 'ini req.body')
        const {email, username, password} = req.body
        console.log(req.body.username)
        const hashpass=encrypt(password)
        var obj={
            password:encrypt(password) 
        }
        var sql = `update users set ? where username='${username}' and email='${email}'`
        db.query(sql, obj,(err,res1)=>{
            if(err) return res.status(500).send(err)
            return res.status(200).send({status:'berhasil'})
        })
    },
}