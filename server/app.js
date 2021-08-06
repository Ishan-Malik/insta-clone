const express=require('express');
const app=express();
const port=5000;
const mongoose=require('mongoose');
const cors = require('cors');
app.use(cors())
require('./models/users');
require('./models/post');
app.use(express.json({limit:"1mb"}));
const {MONGOURI}=require('./key');
app.use(express.json());
app.use(require('./routes/auth'));
app.use(require('./routes/post'));
app.use(require('./routes/user'));
mongoose.connect(MONGOURI,{
    useUnifiedTopology:true,
    useNewUrlParser:true
});
mongoose.connection.on('connected',()=>{
    console.log("connected yes");
})
mongoose.connection.on('error',(err)=>{
    console.log("connected not",err);
})
app.listen(port,()=>{
    console.log("server working",port);
})