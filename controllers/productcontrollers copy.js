const { db } = require('./../connections')
const { uploader } = require('./../helper/upload')
const fs = require('fs')

module.exports = {
    getproducts: (req, res) => {
        var sql = `select p.*,c.idcategory as idcat,c.name as catname,a.*, f.* from products p 
                    join categories c on p.idcategory=c.idcategory
                    join authors a on p.author_id=a.author_id
                    join booksformat f on p.format_id=f.format_id
                    where p.isdeleted=0`
        db.query(sql, (err, product) => {
            if (err) res.status(500).send(err)
            sql = `select idcategory,name from categories`
            db.query(sql, (err, category) => {
                if (err) res.status(500).send(err)
                // return res.send({ product, category })
                sql = `select discount_id,type from discounts where isdeleted=0 order by type`
                db.query(sql, (err, discount) => {
                    if (err) res.status(500).send(err)
                    return res.send({ product, category, discount })
                })
            })
        })
    },
    addproducts: (req, res) => {
        try {
            const path = '/product'//ini terserah
            const upload = uploader(path, 'PROD').fields([{ name: 'image' }])
            upload(req, res, (err) => {
                if (err) {
                    return res.status(500).json({ message: 'Upload picture failed !', error: err.message })
                }
                console.log('lewat')//pada tahap ini foto berhasil diupload
                const { image } = req.files
                // console.log(image)
                const imagePath = image ? path + '/' + image[0].filename : null
                // console.log(imagePath, 'es')
                // console.log(req.body.data)
                const data = JSON.parse(req.body.data)// json parse mengubah json menjadi object javascript
                // console.log(data, 'es')
                data.image = imagePath
                // console.log(data.image, 2)
                // console.log(data.author, 2)

                var tesauthor = {
                    author: data.author
                }

                var sql = `select * from authors where author='${data.author}'`
                db.query(sql, (err, resauthor) => {
                    if (err) return res.status(500).send(err)    //kalau sqlnya error maka send err
                    if (resauthor.length) {
                        // console.log(resauthor)                  //kalau authornya sudah ada
                        console.log('author sudah ada')

                        var tesformat = {
                            isbn: data.isbn,
                            sku: data.sku,
                            height: data.height,
                            width: data.width,
                            weight: data.weight,
                            totalpage: data.totalpage,
                            publishat: data.publishat,
                            language: data.language,
                            publisher: data.publisher
                        }

                        var sql = `insert into booksformat set ?`
                        db.query(sql, tesformat, (err, insertformat) => {
                            if (err) return res.status(500).send(err)    //kalau sqlnya error maka send err
                            console.log('format masuk author sudah ada')

                            var tesproduct = {
                                name: data.name,
                                image: data.image,
                                stock: data.stock,
                                idcategory: data.idcategory,
                                discount_id: data.discount_id,
                                price: data.price,
                                description: data.description,
                                format_id: insertformat.insertId,
                                author_id: resauthor[0].author_id
                            }
                            var sql = `insert into products set ?`
                            db.query(sql, tesproduct, (err, result) => {
                                if (err) {
                                    fs.unlinkSync('./public' + imagePath)
                                    return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err.message })
                                }
                                sql = `select p.*,c.idcategory as idcat,c.name as catname,a.*, f.* from products p 
                                        join categories c on p.idcategory=c.idcategory
                                        join authors a on p.author_id=a.author_id
                                        join booksformat f on p.format_id=f.format_id
                                        where p.isdeleted=0`
                                db.query(sql, (err, result1) => {
                                    if (err) res.status(500).send(err)
                                    return res.status(200).send(result1)
                                })
                            })
                        })
                    } else {
                        var sql = `insert into authors set ?`
                        db.query(sql, tesauthor, (err, insertauthor) => {
                            if (err) return res.status(500).send(err)    //kalau sqlnya error maka send err
                            console.log('author belum ada masuk')

                            var tesformat = {
                                isbn: data.isbn,
                                sku: data.sku,
                                height: data.height,
                                width: data.width,
                                weight: data.weight,
                                totalpage: data.totalpage,
                                publishat: data.publishat,
                                language: data.language,
                                publisher: data.publisher
                            }

                            var sql = `insert into booksformat set ?`
                            db.query(sql, tesformat, (err, insertformat) => {
                                if (err) return res.status(500).send(err)    //kalau sqlnya error maka send err
                                console.log('format masuk')

                                var tesproduct = {
                                    name: data.name,
                                    image: data.image,
                                    stock: data.stock,
                                    idcategory: data.idcategory,
                                    discount_id: data.discount_id,
                                    price: data.price,
                                    description: data.description,
                                    format_id: insertformat.insertId,
                                    author_id: insertauthor.insertId
                                }
                                var sql = `insert into products set ?`
                                db.query(sql, tesproduct, (err, result) => {
                                    if (err) {
                                        fs.unlinkSync('./public' + imagePath)
                                        return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err.message })
                                    }
                                    sql = `select p.*,c.idcategory as idcat,c.name as catname,a.*, f.* from products p 
                                            join categories c on p.idcategory=c.idcategory
                                            join authors a on p.author_id=a.author_id
                                            join booksformat f on p.format_id=f.format_id
                                            where p.isdeleted=0`
                                    db.query(sql, (err, result1) => {
                                        if (err) res.status(500).send(err)
                                        return res.status(200).send(result1)
                                    })
                                })
                            })
                        })
                    }
                })

            })
        } catch (error) {
            return res.status(500).send(error)
        }
    },
    addproducts_backup: (req, res) => {
        try {
            const path = '/product'//ini terserah
            const upload = uploader(path, 'PROD').fields([{ name: 'image' }])
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

                var sql = `insert into products set ?`
                db.query(sql, data, (err, result) => {
                    if (err) {
                        fs.unlinkSync('./public' + imagePath)
                        return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err.message })
                    }
                    sql = `select p.*,c.idcategory as idcat,c.name as catname
                            from products p join categories c on p.idcategory=c.idcategory
                            where p.isdeleted=0`
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
    deleteproducts: (req, res) => {
        const { id } = req.params
        var sql = `select * from products where idproduct=${id}`
        db.query(sql, (err, result) => {
            if (err) res.status(500).send(err)
            if (result.length) {
                var obj = {
                    isdeleted: 1,
                    image: null
                }
                sql = `update products set ? where idproduct=${id}`
                db.query(sql, obj, (err, result2) => {
                    if (err) res.status(500).send(err)
                    console.log(result2)
                    if (result[0].image) {
                        fs.unlinkSync('./public' + result[0].image)
                    }
                    sql = `select p.*,c.idcategory as idcat,c.name as catname,a.*, f.* from products p 
                            join categories c on p.idcategory=c.idcategory
                            join authors a on p.author_id=a.author_id
                            join booksformat f on p.format_id=f.format_id
                            where p.isdeleted=0`
                    db.query(sql, (err, result1) => {
                        if (err) res.status(500).send(err)
                        return res.status(200).send(result1)
                    })
                })
            } else {
                return res.status(500).send({ message: 'ngak ada woi idnya' })
            }
        })

    },
    editproducts: (req, res) => {
        const { id } = req.params
        var sql = `select * from products where idproduct=${id}`
        db.query(sql, (err, result) => {
            if (err) res.status(500).send(err)
            if (result.length) {
                // console.log(result[0])
                try {
                    const path = '/product'//ini terserah
                    const upload = uploader(path, 'PROD').fields([{ name: 'image' }])
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
                        //tambahan codingan
                        var tesauthor = {
                            author: data.author
                        }

                        var sql = `select * from authors where author='${data.author}'`
                        db.query(sql, (err, resauthor) => {
                            if (err) return res.status(500).send(err)    //kalau sqlnya error maka send err
                            if (resauthor.length) {
                                // console.log(resauthor)                  //kalau authornya sudah ada
                                console.log('author sudah ada')
                                var sql = `select * from booksformat where format_id=${result[0].format_id}`
                                db.query(sql, (err, resformatid) => {
                                    if (err) return res.status(500).send(err)    //kalau sqlnya error maka send err
                                    if (resformatid.length) {
                                        // console.log(resformatid)
                                        console.log('isbn sudah ada')
                                        var tesformat = {
                                            isbn: data.isbn,
                                            sku: data.sku,
                                            height: data.height,
                                            width: data.width,
                                            weight: data.weight,
                                            totalpage: data.totalpage,
                                            publishat: data.publishat,
                                            language: data.language,
                                            publisher: data.publisher,
                                        }
                                        sql = `Update booksformat set ? where format_id = ${result[0].format_id};`
                                        db.query(sql, tesformat, (err2, result3) => {
                                            if (err2) {
                                                if (imagePath) {
                                                    fs.unlinkSync('./public' + imagePath);
                                                }
                                                return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err2.message });
                                            }
                                            //if (imagePath) {//hapus foto lama
                                            //     if (result[0].image) {
                                            //         fs.unlinkSync('./public' + result[0].image);
                                            //     }
                                            // }
                                            // sql = `select p.*,c.idcategory as idcat,c.name as catname,a.*, f.* from products p 
                                            //             join categories c on p.idcategory=c.idcategory
                                            //             join authors a on p.author_id=a.author_id
                                            //             join booksformat f on p.format_id=f.format_id
                                            //             where p.isdeleted=0`
                                            // db.query(sql, (err, result2) => {
                                            //     if (err) res.status(500).send(err)
                                            //     return res.status(200).send(result2)
                                            // })
                                        })
                                        var tesproduct = {
                                            name: data.name,
                                            image: data.image,
                                            stock: data.stock,
                                            idcategory: data.idcategory,
                                            discount_id: data.discount_id,
                                            price: data.price,
                                            description: data.description,
                                            format_id: result[0].format_id,
                                            author_id: result[0].author_id
                                        }
                                        console.log(tesproduct.image, 'line 306')
                                        sql = `Update products set ? where idproduct = ${id};`
                                        db.query(sql, tesproduct, (err1, result1) => {
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
                                            sql = `select p.*,c.idcategory as idcat,c.name as catname,a.*, f.* from products p 
                                                        join categories c on p.idcategory=c.idcategory
                                                        join authors a on p.author_id=a.author_id
                                                        join booksformat f on p.format_id=f.format_id
                                                        where p.isdeleted=0`
                                            db.query(sql, (err, result2) => {
                                                if (err) res.status(500).send(err)
                                                return res.status(200).send(result2)
                                            })
                                        })

                                    }
                                })

                                // var sql = `insert into booksformat set ?`
                                // db.query(sql, tesformat, (err, insertformat) => {
                                //     if (err) return res.status(500).send(err)    //kalau sqlnya error maka send err
                                //     console.log('format masuk author sudah ada')

                                //     // var tesproduct = {

                                //     // }
                                // })
                            } else {
                                var sql = `insert into authors set ?`
                                db.query(sql, tesauthor, (err, insertauthor) => {
                                    if (err) return res.status(500).send(err)    //kalau sqlnya error maka send err
                                    console.log('author belum ada masuk')

                                    var tesformat = {
                                        isbn: data.isbn,
                                        sku: data.sku,
                                        height: data.height,
                                        width: data.width,
                                        weight: data.weight,
                                        totalpage: data.totalpage,
                                        publishat: data.publishat,
                                        language: data.language,
                                        publisher: data.publisher
                                    }

                                    var sql = `Update booksformat set ? where format_id = ${result[0].format_id}`
                                    db.query(sql, tesformat, (err, insertformat) => {
                                        if (err) return res.status(500).send(err)    //kalau sqlnya error maka send err
                                        console.log('format masuk')

                                        var tesproduct = {
                                            name: data.name,
                                            image: data.image,
                                            stock: data.stock,
                                            idcategory: data.idcategory,
                                            discount_id: data.discount_id,
                                            price: data.price,
                                            description: data.description,
                                            format_id: result[0].format_id,
                                            author_id: insertauthor.insertId
                                        }

                                        sql = `Update products set ? where idproduct = ${id};`
                                        db.query(sql, tesproduct, (err1, result1) => {
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
                                            sql = `select p.*,c.idcategory as idcat,c.name as catname,a.*, f.* from products p 
                                                    join categories c on p.idcategory=c.idcategory
                                                    join authors a on p.author_id=a.author_id
                                                    join booksformat f on p.format_id=f.format_id
                                                    where p.isdeleted=0`
                                            db.query(sql, (err, result2) => {
                                                if (err) res.status(500).send(err)
                                                return res.status(200).send(result2)
                                            })
                                        })
                                    })
                                })
                            }
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
    editproducts_backup: (req, res) => {
        const { id } = req.params
        var sql = `select * from products where idproduct=${id}`
        db.query(sql, (err, result) => {
            if (err) res.status(500).send(err)
            if (result.length) {
                try {
                    const path = '/product'//ini terserah
                    const upload = uploader(path, 'PROD').fields([{ name: 'image' }])
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
                        sql = `Update products set ? where idproduct = ${id};`
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
                            sql = `select p.*,c.idcategory as idcat,c.name as catname,a.*, f.* from products p 
                                    join categories c on p.idcategory=c.idcategory
                                    join authors a on p.author_id=a.author_id
                                    join booksformat f on p.format_id=f.format_id
                                    where p.isdeleted=0`
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
    getproductshome: (req, res) => {
        var sql = `select p.*,c.idcategory as idcat,c.name as catname
                    from products p join categories c on p.idcategory=c.idcategory
                    where p.isdeleted=0`
        db.query(sql, (err, product) => {
            if (err) res.status(500).send(err)
            res.send(product)
        })
    },
    getcategory: (req, res) => {
        var sql = `select idcategory,name from categories`
        db.query(sql, (err, result) => {
            if (err) res.status(500).send(err)
            return res.status(200).send(result)
        })
    },
    filterproductspage: (req, res) => {
        const { id } = req.params
        // const { page } = req.query
        // const offset = parseInt((page - 1) * 8)
        var sql = `select p.*,c.idcategory as idcat,c.name as catname,a.*, f.* from products p 
                    join categories c on p.idcategory=c.idcategory
                    join authors a on p.author_id=a.author_id
                    join booksformat f on p.format_id=f.format_id
                    where p.isdeleted=0 and p.idcategory=${id}`
        db.query(sql, (err, product) => {
            if (err) res.status(500).send(err)
            sql = `select idcategory,name from categories`
            db.query(sql, (err, category) => {
                if (err) res.status(500).send(err)
                // return res.send({ product, category })
                const { page } = req.query
                const offset = parseInt((page - 1) * 8)
                var sql = `select p.*,c.idcategory as idcat,c.name as catname,a.*, f.* from products p 
                            join categories c on p.idcategory=c.idcategory
                            join authors a on p.author_id=a.author_id
                            join booksformat f on p.format_id=f.format_id
                            where p.isdeleted=0 and p.idcategory=${id}
                            LIMIT ${offset},8`
                db.query(sql, (err1, result) => {
                    if (err1) res.status(500).send({ err1, message: 'error get total filter product' })
                    // return res.send(result)
                    sql = `select discount_id,type from discounts where isdeleted=0 order by type`
                    db.query(sql, (err, discount) => {
                        if (err) res.status(500).send(err)
                        return res.send({ product, category, result, discount })
                    })
                    // return res.send({ product, category, result })
                })
            })
        })
    },
    filterproducts: (req, res) => {
        const { id } = req.params
        // const { page } = req.query
        // const offset = parseInt((page - 1) * 8)
        var sql = `select p.*,c.idcategory as idcat,c.name as catname,a.*, f.* from products p 
                    join categories c on p.idcategory=c.idcategory
                    join authors a on p.author_id=a.author_id
                    join booksformat f on p.format_id=f.format_id
                    where p.isdeleted=0 and p.idcategory=${id}`
        db.query(sql, (err, product) => {
            if (err) res.status(500).send(err)
            sql = `select idcategory,name from categories`
            db.query(sql, (err, category) => {
                if (err) res.status(500).send(err)
                // return res.send({ product, category })
                sql = `select discount_id,type from discounts where isdeleted=0 order by type`
                db.query(sql, (err, discount) => {
                    if (err) res.status(500).send(err)
                    return res.send({ product, category, discount })
                })
            })
        })
    },
    filterdiscountproducts : (req,res) => {
        var sql = `select p.*,c.idcategory as idcat,c.name as catname,d.discount_id as iddisc,d.type as disctype,a. *, f.* from products p 
                    join categories c on p.idcategory=c.idcategory
                    join discounts d on p.discount_id=d.discount_id
                    join authors a on p.author_id=a.author_id
                    join booksformat f on p.format_id=f.format_id
                    where p.isdeleted=0`
        db.query(sql, (err, product) => {
            if (err) res.status(500).send(err)
            sql = `select idcategory,name from categories`
            db.query(sql, (err, category) => {
                if (err) res.status(500).send(err)
                // return res.send({ product, category })
                sql = `select discount_id,type from discounts where isdeleted=0 order by type`
                db.query(sql, (err, discount) => {
                    if (err) res.status(500).send(err)
                    return res.send({ product, category, discount })
                })
            })
        })
    },

    // ============= User ============= //

    getProductUser: (req, res) => {
        const { page, sortname } = req.query
        // const offset = parseInt((page - 1) * 8)
        if (sortname == 1) {
            var sql = `select p.*,c.idcategory as idcat,c.name as catname,a.*, f.* from products p 
                            join categories c on p.idcategory=c.idcategory
                            join authors a on p.author_id=a.author_id
                            join booksformat f on p.format_id=f.format_id
                            where p.isdeleted=0 order by p.name desc
                            LIMIT ${page},8`
            db.query(sql, (err, result) => {
                if (err) res.status(500).send({ err, message: 'error get total product' })
                return res.send(result)
            })

        } else {
            var sql = `select p.*,c.idcategory as idcat,c.name as catname,a.*, f.* from products p 
                            join categories c on p.idcategory=c.idcategory
                            join authors a on p.author_id=a.author_id
                            join booksformat f on p.format_id=f.format_id
                            where p.isdeleted=0 order by p.name
                            LIMIT ${page},8`
            db.query(sql, (err, result) => {
                if (err) res.status(500).send({ err, message: 'error get total product' })
                return res.send(result)
            })
        }
    },

    getAllProductUser: (req, res) => {
        // const {page}=req.query
        // const offset = parseInt((page-1)*8)
        var sql = `select p.*,c.idcategory as idcat,c.name as catname,a.*, f.* from products p 
                        join categories c on p.idcategory=c.idcategory
                        join authors a on p.author_id=a.author_id
                        join booksformat f on p.format_id=f.format_id
                        where p.isdeleted=0`
        db.query(sql, (err, result) => {
            if (err) res.status(500).send({ err, message: 'error get total product' })
            return res.send(result)
        })
    },
    // getFilterProductUser: (req, res) => {
    //     const { page } = req.query
    //     const offset = parseInt((page - 1) * 8)
    //     // console.log(page)
    //     // if(search){
    //     //     var sql= `  SELECT p.*,c.id AS idcat,c.name AS catnama
    //     //                 FROM products p 
    //     //                     JOIN category c 
    //     //                     ON p.categoryId=c.id
    //     //                 WHERE p.isdeleted=0 AND p.name LIKE '%${search}%'
    //     //                 LIMIT ${page},8`
    //     //     db.query(sql,(err,result)=>{
    //     //         if(err) res.status(500).send({err,message:'error get product search'})
    //     //         return res.send(result)
    //     //     })
    //     // }else if(filter){
    //     //     var sql= `  SELECT p.*,c.id AS idcat,c.name AS catnama
    //     //                 FROM products p 
    //     //                     JOIN category c 
    //     //                     ON p.categoryId=c.id
    //     //                 WHERE p.isdeleted=0 AND p.categoryId=${filter}
    //     //                 LIMIT ${page},8`
    //     //     db.query(sql,(err,result)=>{
    //     //         if(err) res.status(500).send({err,message:'error get total product'})
    //     //         return res.send(result)
    //     //     })
    //     // }else{
    //     var sql = `select p.*,c.idcategory as idcat,c.name as catname,a.*, f.* from products p 
    //                     join categories c on p.idcategory=c.idcategory
    //                     join authors a on p.author_id=a.author_id
    //                     join booksformat f on p.format_id=f.format_id
    //                     where p.isdeleted=0
    //                     LIMIT ${offset},8`
    //     db.query(sql, (err, result) => {
    //         if (err) res.status(500).send({ err, message: 'error get total product' })
    //         return res.send(result)
    //     })
    //     // }
    // },
    gettotalproduk: (req, res) => {
        var sql = `  SELECT COUNT(idproduct) AS total
                        FROM products p
                        WHERE p.isdeleted=0`
        db.query(sql, (err, result) => {
            if (err) res.status(500).send({ err, message: 'error get total product' })
            return res.send(result[0])
        })
    },
    getdetailproduk: (req, res) => {
        console.log(req.params)
        const { id } = req.params
        // const offset = parseInt((page-1)*8)
        var sql = `select p.*,c.idcategory as idcat,c.name as catname,a.*, f.* from products p 
                        join categories c on p.idcategory=c.idcategory
                        join authors a on p.author_id=a.author_id
                        join booksformat f on p.format_id=f.format_id
                        where p.isdeleted=0 and idproduct=${id}`
        db.query(sql, (err, result) => {
            if (err) res.status(500).send({ err, message: 'error get total product' })
            return res.send(result)
        })
    }
}