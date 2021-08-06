const express=require('express');
const router=express.Router();
const mongoose=require("mongoose");
const verify=require('../middleware/verify');
const Post=mongoose.model("post");
router.get('/mypost',verify,(req,res)=>{
    Post.find({postedby:req.user._id})
    .populate("postedby","_id name")
    .then(posts=>{
        res.json({posts})
    })
    .catch(err=>{
        console.log(err);
    })
})
router.get('/allpost',verify,(req,res)=>{
    Post.find()
    .populate("postedby","_id name image")
    .populate("comments.postedby","_id name")
    .sort("-createdAt")
    .then(result=>{
        res.json({result})
    })
    .catch(err=>{
        console.log(err);
    })
})
router.get('/getsubpost',verify,(req,res)=>{
    Post.find({postedby:{$in:req.user.following}})
    .populate("postedby","_id name")
    .populate("comments.postedby","_id name")
    .sort("-createdAt")
    .then(result=>{
        res.json({result})
    })
    .catch(err=>{
        console.log(err);
    })
})
router.put('/like',verify,(req,res)=>{
Post.findByIdAndUpdate(req.body.postId,{
$push:{likes:req.user._id}    
},{
new:true
})
.populate("postedby","_id name")
.exec((err,result)=>{
    if(err){
     res.status(422).json({error:err})
    }
    else
    {
        res.json(result)
    }
})
})
router.put('/unlike',verify,(req,res)=>{
    Post.findByIdAndUpdate(req.body.postId,{
    $pull:{likes:req.user._id}    
    },{
    new:true
    })
    .populate("postedby","_id name")
    .exec((err,result)=>{
        if(err){
         res.status(422).json({error:err})
        }
        else
        {
            res.json(result)
        }
    })
    })
    router.put('/comment',verify,(req,res)=>{
        const comment={
            text:req.body.text,
            postedby:req.user
        }
        Post.findByIdAndUpdate(req.body.postId,{
        $push:{comments:comment}    
        },{
        new:true
        })
        .populate("comments.postedby","_id name")
        .populate("postedby","_id name")
        .exec((err,result)=>{
            if(err){
             res.status(422).json({error:err})
            }
            else
            {
                res.json(result)
            }
        })
        })
router.delete('/deletepost/:postId',verify,(req,res)=>{
    console.log(req.params.postId)
    Post.findOne({_id:req.params.postId})
    .populate("postedby","_id")
    .exec((err,post)=>{
      if(err || !post)
      {
          res.json({error:err})
      }
      if(post.postedby._id.toString()===req.user._id.toString())
      {
          post.remove()
          .then((result)=>{
              res.json(result)
          })
          .catch(err=>{
              res.json({error:err})
          })
      }
    })
    
})
router.post('/createpost',verify,(req,res)=>{
    const {title,body,url}=req.body;
    if(!title || !body ||!url)
    {
        res.send("message:enter information");
    }
    req.user.password=undefined;
    const post=new Post({
    title,
    body,
    photo:url,
    postedby:req.user
    });
    post.save()
    .then(result=>{
        res.json({post:result});
    })
    .catch(err=>{
        console.log(err);
    })
})
module.exports=router