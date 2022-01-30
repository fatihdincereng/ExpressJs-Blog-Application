const express = require("express");
const router = express.Router();
const User = require("../models/User");
// Kayit Ol Get ve Post İişlemlerine İhtiyacın Var.

router.get('/register', (req, res) => {
    res.render('site/register');
});


router.post('/register', (req, res) => {
    User.create(req.body, (err, user) => {
        req.session.sessionFlash={
            type:"alert alert-success",
            message:"Kullanıcı Kaydedildi Giriş Yapınız"
        }
        res.redirect("/user/login")
    });
});

router.get('/login', (req, res) => {
    res.render('site/login');
});

router.get('/logout', (req, res) => {
    req.session.destroy(()=>{
        res.redirect('/');
    })
});

// Kullanıcı Kontrolü Çok Önemli Kısım
// 1.Aşama Olarak Değer Kontrolü Yapacağın için frontendden req.bodyden email ve password değerlerini alman lazım daha sonra veritabanındakilerle karşılaştırıp işlem yapman gerekir.

router.post('/login', (req, res) => {
    const { email, password } = req.body;
    // FrontEnddeki veriye göre arama yaparız Algoritma Mantığıdır Bu.
    User.findOne({ email }, (err, user) => {
        // Userda Gelen Verinin bilgileri nesne halinde tutulur
        if (user) {
            if (user.password == password) {
                // User Session İşlemi Yapılacak.
                req.session.UserId=user._id;
                res.redirect('/')
            }
            else {
                res.redirect('/user/login')
            }
        }
        else {
            res.redirect('/user/register');
        }
    })
})



module.exports = router;