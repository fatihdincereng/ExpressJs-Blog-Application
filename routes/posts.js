const express=require("express");
const router=express.Router();
const Post=require("../models/Post");
const path=require("path");
// Post İşlemi İçin Gerekli Routerlar
// Zaten /posts app de tanımlandığı için /posts yolunu takip edecek middleware sayesinde
router.get('/new', (req, res) => {
    if(req.session.UserId){
        return res.render('site/addpost');
    }
    else{
        res.redirect('/user/login')
    }


});


router.post('/test', (req, res) => {
    // İmage De Post Edicez ham Nene Halinde Tanımladık Sonra BU rESMİ iSİMİYLE bERABER dOSYALARA aKTARICAZ
    let post_image=req.files.post_image;
    post_image.mv(path.resolve(__dirname,'../public/img/postimages',post_image.name)); // Vriyi Dosya Olarak Kaydeder Post İle

    // Veri Tabanına Eklerken String Halinde EKlemesi Gerekir Oyüzden String Yolu veritabanına katırılırken verilir

    Post.create({
        ...req.body,
        post_image:`/img/postimages/${post_image.name}` // Postimagename olarak kaydediliyor git o begelyi al post_image e at namine
    });
    

    // Middlewareda Böyle Bir Değişken duruyor bunu istediğimiz yerde kullanabiliriz. Middleware da İstediğimiz Yerde Kullanmak İçin Zaten Tanımladık
    // Middleware da Tanımlam İstediğin Yerde Kullan Mantığı NOdejs Özetidir.
    req.session.sessionFlash={
        type:"alert alert-success",
        message:"Postunuz Kaydedildi"
    }
    // Bu Değişkenleri Parametre Halinde Render Ettik ve handlebars da bu değişkenleri kullanmayı sağlayacağız.

    res.redirect('/blog');
});

// İd Ye Gore Get İşlemi Yapıldığında Sayfaya Gitmesi Sağlandı İd Yİ Req De nALICAK pARAMETRE OLARAK TA İD OLUCAK FUNCTİON (A,B) gİBİ dÜŞÜN
router.get('/:id',(req,res)=>{
    Post.findById(req.params.id).lean().then(post=>{
        res.render('site/post',{post:post});
    });
    console.log(req.params);
});

module.exports=router;