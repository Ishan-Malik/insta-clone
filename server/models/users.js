const mongoose=require('mongoose');
const { Schema } = mongoose;
const {ObjectId}=mongoose.Schema.Types;

const userSchema=new Schema({
name:{type:String,required:true},
password:{type:String,required:true},
email:{type:String,required:true},
image:{
type:String,
default://add default image
},
follower:[{type:ObjectId,ref:"user"}],
following:[{type:ObjectId,ref:"user"}]
})
mongoose.model('user',userSchema);