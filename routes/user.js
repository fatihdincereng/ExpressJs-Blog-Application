const express = require("express");
const router = express.Router();
const User = require("../models/User");

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


router.post('/login', (req, res) => {
    const { email, password } = req.body;
    User.findOne({ email }, (err, user) => {
        if (user) {
            if (user.password == password) {
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
