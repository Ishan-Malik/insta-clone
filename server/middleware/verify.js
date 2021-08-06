const jwt=require('jsonwebtoken');
const { JWT_SECRET } = require('../key');
const mongoose=require('mongoose');
const User=mongoose.model('user');
module.exports=(req,res,next)=>{
   const {authorization} =req.headers;
   if(!authorization)
   {
      return res.send('message:user not logged in');
   }
   const token= authorization.replace("Bearer ","");
   jwt.verify(token,JWT_SECRET,(err,payload)=>{
       if(err)
       {
          return res.send('user not found');
       }
       const _id=payload.id;
       User.findById(_id).then(userdata=>{
         req.user=userdata;
         next()
       })
      
   })
}