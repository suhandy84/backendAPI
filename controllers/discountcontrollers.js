const { db } = require('./../connections')
const { uploader } = require('./../helper/upload')
const fs = require('fs')

module.exports = {
    getdiscounts: (req, res) => {
        var sql = `select * from discounts
                    where discounts.isdeleted=0 and discount_rate>0 order by type`
        db.query(sql, (err, result) => {
            if (err) res.status(500).send(err)
            return res.send(result)
        })
    },
    adddiscounts: (req, res) => {
        try {
            const path = '/discount'//ini terserah
            const upload = uploader(path, 'DISC').fields([{ name: 'image' }])
            upload(req, res, (err) => {
                if (err) {
                    return res.status(500).json({ message: 'Upload picture failed !', error: err.message })
                }
                console.log('lewat')//pada tahap ini foto berhasil diupload
                const { image } = req.files
                console.log(image)
                const imagePath = image ? path + '/' + image[0].filename : null
                console.log(imagePath)
                console.log(req.body.data)
                const data = JSON.parse(req.body.data)// json parse mengubah json menjadi object javascript
                console.log(data, '1')
                data.image = imagePath
                console.log(data, 2)

                var sql = `insert into discounts set ?`
                db.query(sql, data, (err, result) => {
                    if (err) {
                        fs.unlinkSync('./public' + imagePath)
                        return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err.message })
                    }
                    sql = `select * from discounts
                            where discounts.isdeleted=0 and discount_rate>0 order by type`
                    db.query(sql, (err, result1) => {
                        if (err) res.status(500).send(err)
                        return res.status(200).send(result1)
                    })
                })
            })
        } catch (error) {
            return res.status(500).send(error)
        }
    },
    editdiscounts: (req, res) => {
        const { id } = req.params
        var sql = `select * from discounts where discount_id=${id}`
        db.query(sql, (err, result) => {
            if (err) res.status(500).send(err)
            if (result.length) {
                try {
                    const path = '/discount'//ini terserah
                    const upload = uploader(path, 'DISC').fields([{ name: 'image' }])
                    upload(req, res, (err) => {
                        if (err) {
                            return res.status(500).json({ message: 'Upload post picture failed !', error: err.message });
                        }
                        console.log('lewat')
                        const { image } = req.files;
                        const imagePath = image ? path + '/' + image[0].filename : null;
                        const data = JSON.parse(req.body.data);
                        if (imagePath) {
                            data.image = imagePath;
                        }
                        sql = `Update discounts set ? where discount_id = ${id};`
                        db.query(sql, data, (err1, result1) => {
                            if (err1) {
                                if (imagePath) {
                                    fs.unlinkSync('./public' + imagePath);
                                }
                                return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err1.message });
                            }
                            if (imagePath) {//hapus foto lama
                                if (result[0].image) {
                                    fs.unlinkSync('./public' + result[0].image);
                                }
                            }
                            sql = `select * from discounts
                                    where discounts.isdeleted=0 and discount_rate>0 order by type`
                            db.query(sql, (err, result2) => {
                                if (err) res.status(500).send(err)
                                return res.status(200).send(result2)
                            })
                        })
                    })
                } catch (error) {
                    return res.status(500).send(error)
                }
            } else {
                return res.status(500).send({ message: 'nggak ada woy idnya' })
            }
        })
    },
    deletediscounts: (req,res) => {
        const { id } = req.params
        var sql = `select * from discounts where discount_id=${id}`
        db.query(sql, (err, result) => {
            if (err) res.status(500).send(err)
            if (result.length) {
                var obj = {
                    isdeleted: 1,
                    image:null
                }
                sql = `update discounts set ? where discount_id=${id}`
                db.query(sql, obj, (err, result2) => {
                    if (err) res.status(500).send(err)
                    console.log(result2)
                    if (result[0].image) {
                        fs.unlinkSync('./public' + result[0].image)
                    }
                    sql = `select * from discounts
                            where discounts.isdeleted=0 and discount_rate>0 order by type`
                    db.query(sql, (err, result1) => {
                        if (err) res.status(500).send(err)
                        return res.status(200).send(result1)
                    })
                })
            } else {
                return res.status(500).send({ message: 'ngak ada woi idnya' })
            }
        })
    }
}