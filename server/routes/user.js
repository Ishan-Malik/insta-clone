const express=require('express');
const router=express.Router();
const mongoose=require("mongoose");
const verify=require('../middleware/verify');
const Post=mongoose.model("post");
const User=mongoose.model("user");
router.get('/user/:id',verify,(req,res)=>{
    User.findOne({_id:req.params.id})
    .select("-password")
    .then(user=>{
        Post.find({postedby:req.params.id})
        .populate("postedby","_id name")
        .exec((err,result)=>{
         if(err)
         {
             res.json(err)
         }
         res.json({user,result})
        })
    })
    .catch(err=>{
     return res.json({message:"user not found"})
    })
})
router.put('/follow',verify,(req,res)=>{
    User.findByIdAndUpdate(req.body.followId,{
    $push:{follower:req.user._id}    
    },{
    new:true
    },
    (err,result)=>{
        if(err){
        return res.status(422).json({error:err})
        }
        User.findByIdAndUpdate(req.user._id,{
            $push:{following:req.body.followId}   
        },{
            new:true
        })
        .then((result1)=>{
            res.json(result1)
        })
        .catch(err=>{
            res.json(err)
        })
    })
    })
    router.put('/unfollow',verify,(req,res)=>{
        User.findByIdAndUpdate(req.body.followId,{
        $pull:{follower:req.user._id}    
        },{
        new:true
        },
        (err,result)=>{
            if(err){
             res.status(422).json({error:err})
            }
            User.findByIdAndUpdate(req.user._id,{
                $pull:{following:req.body.followId}   
            },{
                new:true
            })
            .then((result1)=>{
                res.json(result1)
            })
            .catch(err=>{
                res.json(err)
            })
        })
        })
        router.post('/searchuser',(req,res)=>{
            const newuser=new RegExp("^"+req.body.query)
            User.find({email:{$regex:newuser}})
            .select("_id email")
            .then(user=>{
                res.json({user})
            })
            .catch(err=>{
                res.json({err})
            })
        })
        router.put('/updatepic',verify,(req,res)=>{
            User.findByIdAndUpdate(req.user._id,{$set:{image:req.body.image}},{new:true},(err,result)=>{
                if(err)
                {
                    res.json(err)
                }
                else
                {
                    res.json(result)
                }
            })
        })
module.exports=router