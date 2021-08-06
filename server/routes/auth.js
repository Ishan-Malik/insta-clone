const express=require('express');
const router=express.Router();
const mongoose=require("mongoose");
const User=mongoose.model("user");
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const {JWT_SECRET}=require('../key');
const verify=require('../middleware/verify');
const sgMail=require('@sendgrid/mail')
sgMail.setApiKey(//send-grid-api)
router.post('/signup',(req,res)=>{
const {name,email,password,image}=req.body;
if(!name||!email||!password)
{
    return res.send("message:please enter fields");
}
User.findOne({email:email})
.then((saveduser)=>{
if(saveduser)
{
  return res.send("message:email already exist");
}
bcrypt.hash(password,12)
.then((hashedvalue)=>{
    const user =new User({
            name,
            email,
            password:hashedvalue,
            image
        });
        user.save()
        .then(user=>{
             const message ={ 
                to:JSON.stringify(user.email),
                from:{
                    name:'instagram',
                    email://email
                },
                subject:'signup success',
                html:"<h1>welcome to instagram</h1>"
            }
            sgMail.send(message)
        res.send('saved')
        })
        .catch(err=>{
            console.log(err);
        })
})
.catch(err=>{
    console.log(err);
})
})
.catch((err)=>{
    res.send(err);
})
})
router.post('/signin',(req,res)=>{
    const {email,password}=req.body;
    if(!email||!password)
    {
        res.send("message:enter email or password");
    }
    User.findOne({email:email})
    .then(saved=>{
        if(!saved)
        {
            res.send("message:invalid login");
        }
       bcrypt.compare(password,saved.password)
       .then(pol=>{
           if(pol)
           {
               const {_id,name,email,follower,following,image}=saved;
              const token= jwt.sign({id:saved._id},JWT_SECRET);
              const lp={
                  _id,
                  name,
                  email,
                  image,
                  follower,
                  following,
                  token
              }
              res.send(lp);
           }
           else
           {
            res.send("message:invalid login")
           }
       })
       .catch(err=>{
        console.log(err);
       })
    })
    .catch(err=>{
        console.log(err);
    })
})
module.exports=router;