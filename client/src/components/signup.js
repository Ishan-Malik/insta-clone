import React,{useState,useEffect} from 'react';
import {Link,useHistory} from 'react-router-dom';
import M from 'materialize-css'
var axios = require('axios');
const Signup=()=>{
  const [name,setName]=useState("");
  const [password,setPassword]=useState("");
  const [pic,setPic]=useState("");
  const [url,setUrl]=useState(undefined);
  const [email,setEmail]=useState("");
  const history=useHistory();
 
  const imageing=async()=>{
    var formData = new FormData();
    formData.append("file", pic);
    formData.append("upload_preset","insta-clone");
    formData.append("cloud_name","-----");
 const data= await (await fetch(/**/{
      method:'POST',
      body:formData
    }))
    data.json()
    .then(data=>{
      setUrl(data.url)
    })
    .catch(err=>{
      console.log(err)
    })
  }
  const holestuff=()=>{
    if(!/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email))
    {
       return(
          M.toast({html:"enter valid email",classes:"#c62828 red darken-3"}) 
       )
    }
var config = {
  method: 'POST',
  url: 'http://localhost:5000/signup',
  data: {
      name,
      email,
      password,
      image:url
    },
};

axios(config)
.then(function (response) {    
  if(response.data==="message:please enter fields")
       {
           response.data="please enter fields"
      M.toast({html:response.data,classes:"#c62828 red darken-3"})
       } 
       else if(response.data==="message:email already exist")
       {
          response.data="email already exist"
          M.toast({html:response.data,classes:"#43a047 green darken-1"})  
          history.push('/signin')
       }
       else
       {
          response.data="saved succesfully"
          M.toast({html:response.data,classes:"#43a047 green darken-1"})  
          history.push('/signin')
       }
  })
.catch(function (error) {
  console.log(error);
});
  }
  const Postdata=()=>{
    if(pic)
    {
      imageing()
    }
    else
    {
    holestuff()
    }
}
    return(
        <div className="mycard">
        <div className="card auth-card">
        <h2>Instagram</h2>
        <input type="text" placeholder="name" value={name} onChange={(e)=>setName(e.target.value)} />
        <input type="text" placeholder="email" value={email} onChange={(e)=>setEmail(e.target.value)} />
        <input type="password" placeholder="password" value={password} onChange={(e)=>setPassword(e.target.value)} />
        <div class="file-field input-field" style={{marginLeft:"10px"}}>
      <div class="btn">
        <span>Upload Image</span>
        <input type="file" onChange={(e)=>{setPic(e.target.files[0])}}/>
      </div>
      <div class="file-path-wrapper">
        <input class="file-path validate" type="text" />
      </div>
    </div>
        <button class="btn waves-effect waves-light" style={{marginTop:10}} onClick={()=>Postdata()}>Signup
       </button>
       <br></br>
       <br></br>
       <Link to='/signin'>already have account?</Link>
        </div>
        </div>
    )
}
export default Signup;