import React,{useState,useEffect} from 'react';
import axios from 'axios';
import {useHistory} from 'react-router-dom';
import M from 'materialize-css'
const Createpost=()=>{
  const [title,setTitle]=useState("");
  const [body,setBody]=useState("");
  const [pic,setPic]=useState("");
  const [url,setUrl]=useState("");
  const history=useHistory();
  useEffect(() => {
    if(url)
    {
      var config = {
        method: 'POST',
        url: 'http://localhost:5000/createpost',
        data: {
          title,
          body,
          url
          },
          headers:{
            "Authorization":"Bearer "+localStorage.getItem("jwt")
          }
      };
      axios(config)
      .then(function (response) {    
        if(response.data==="message:enter information")
             {
                 response.data="enter information"
            M.toast({html:response.data,classes:"#c62828 red darken-3"})
             } 
             else if(response.data==="message:user not logged in")
             {
                 response.data="user not logged in"
            M.toast({html:response.data,classes:"#c62828 red darken-3"})
             } 
             else
             {
                response.data="uploded"
                M.toast({html:response.data,classes:"#43a047 green darken-1"})  
                history.push('/')
             }
        })
      .catch(function (error) {
        console.log(error);
      });
    }
  },[url])
  const Postdata=async()=>{
    var formData = new FormData();
    formData.append("file", pic);
    formData.append("upload_preset","insta-clone");
    formData.append("cloud_name","-------");
 const data= await (await fetch(/*link for fetching photos from cloudinary*/,{
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
return(
<div style={{width:"500px",marginLeft:"400px",marginTop:"40px",height:"600px"}}>
<div className="card input-card">
<input type="text" placeholder="Title" style={{marginLeft:"10px"}} value={title} onChange={(e)=>{setTitle(e.target.value)}}></input>
<input type="text" placeholder="Body" style={{marginLeft:"10px"}} value={body} onChange={(e)=>{setBody(e.target.value)}}></input>
<div class="file-field input-field" style={{marginLeft:"10px"}}>
      <div class="btn">
        <span>Upload Image</span>
        <input type="file" onChange={(e)=>{setPic(e.target.files[0])}}/>
      </div>
      <div class="file-path-wrapper">
        <input class="file-path validate" type="text" />
      </div>
    </div>
<button class="btn waves-effect waves-light" style={{marginLeft:"200px"}} onClick={()=>Postdata()}>post
       </button>
</div>
</div>
)
}
export default Createpost;