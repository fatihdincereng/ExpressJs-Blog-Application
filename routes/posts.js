const express=require("express");
const router=express.Router();
const Post=require("../models/Post");
const path=require("path");


router.get('/new', (req, res) => {
    if(req.session.UserId){
        return res.render('site/addpost');
    }
    else{
        res.redirect('/user/login')
    }


});


router.post('/test', (req, res) => {
    let post_image=req.files.post_image;
    post_image.mv(path.resolve(__dirname,'../public/img/postimages',post_image.name));

    Post.create({
        ...req.body,
        post_image:`/img/postimages/${post_image.name}` // Postimagename olarak kaydediliyor git o begelyi al post_image e at namine
    });
    


    req.session.sessionFlash={
        type:"alert alert-success",
        message:"Postunuz Kaydedildi"
    }

    res.redirect('/blog');
});


router.get('/:id',(req,res)=>{
    Post.findById(req.params.id).lean().then(post=>{
        res.render('site/post',{post:post});
    });
    console.log(req.params);
});

module.exports=router;
