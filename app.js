const fs = require("fs");
const path = require("path");
const express = require("express");
const { engine } = require('express-handlebars');
const moment = require("moment");
const app = express();
const mongoose = require('mongoose');
var bodyParser = require('body-parser');
const fileupload = require("express-fileupload");
const generateDate = require("./helpers/generateDate").generateDate;
const expresssession = require("express-session");
const MongoStore = require('connect-mongo');
// 8000 Portta Çalışır. 
const port = 7000;

//Mongo Db Bağlantisi
var mongoDB = 'mongodb://127.0.0.1/nodeblog_db';
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });


// Statik Dosyalar Middleware Olusturuldu
app.use(express.static('public'));

// FileUplod İmage İçin
app.use(fileupload());




// Session Middleware Eklendi
app.use(expresssession({
    secret: "testotesto",
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: mongoDB })
}));


// Flash Message Middleware
app.use((req, res, next) => {
    // Sessiondaki sESSİON fLASHI lOCALE kAYDEDERİZ. lOCALE kAYDETTİKTEN SONRA O MESAJI SİLERİZ. lOCALDE dURUR Session Olarak durmasını ismediğimiz için sileriz
    res.locals.sessionFlash = req.session.sessionFlash;
    delete req.session.sessionFlash;
    next();
});


// Link Ayarlama Middlware
app.use((req, res, next) => {
    const { UserId } = req.session
    if (UserId) {
        res.locals = {
            displayLink: true
        }
    }
    else {
        res.locals = {
            displayLink: false
        }
    }
    // Diplay Link Res. lOcalde Tutuluyor Res.local ile Sunucudan İstemciye Ya Veri Gonderilir Yada Veri tutulur
    next();
})


// Genarete Date Helperini Çağırdık. Birinci Değişken Consttan Aldığımız Değişken İkinci Değişken Handlebarsa gönderdiğmiz değişken bunu unutma 
app.engine('handlebars', engine({ helpers: { tarih: generateDate } }))
app.set('view engine', 'handlebars');
app.set('views', './views');

// BodyParser Sayesinde Sunucuya AKtarılan Form Namelerini Almayı ve Kullanmayı Sağladık
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


//path.resolve(__dirname,site/index.html) Path İle Yol Belirttik Ana App İn Olduğu Yolu Konumu belirttik:res.sendFile(path.resolve(__dirname, 'site/index.html'));


//Middleware / aGİden Her Link İle BEraber maindeki routeslar buna göre çalışır
const main = require("./routes/main");
const posts = require("./routes/posts");
const user = require('./routes/user');

// / İle Başlayan Roytelar Maine Giderek Yol Oluşturuldu. /posts ile başyalan routeslarıa yol oluşturuldu.
app.use('/', main);
app.use('/posts', posts);
app.use('/user', user);

app.listen(port, () => {
    console.log(`Sunucu http://localhost:${port} da çalışır.`)
})