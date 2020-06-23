const mysql=require('mysql')

const db=mysql.createConnection({
    host:'localhost',
    user:'handy',
    password:'suhand13712',//dari workbench
    database:'final_product',
    port:'3306'
})

db.connect((err)=>{         //cek apakah sudah terubung ke mysql
    if(err){
        console.log(err)
    }
    console.log('connect sudah')
})

module.exports=db