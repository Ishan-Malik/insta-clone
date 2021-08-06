import React,{useEffect,useState,useContext} from 'react';
import axios from 'axios';
import {UserContext} from '../App';
const Profile=()=>{
  const{state,dispatch}=useContext(UserContext)
    const state1=JSON.parse(localStorage.getItem("user"))
    const [pics,setPics]=useState([]);
    const [pic,setPic]=useState("");
    useEffect(() => {
        var config = {
            method: 'GET',
            url: 'http://localhost:5000/mypost',
            headers:{
                "Authorization":"Bearer "+localStorage.getItem("jwt")
              }
          };
          axios(config)
         .then(result=>{
             console.log(result)
             setPics(result.data.posts)
         })
         .catch(err=>{
             console.log(err)
         }) 
    }, [])
    const imageing=async()=>{
        var formData = new FormData();
        formData.append("file", pic);
        formData.append("upload_preset","insta-clone");
        formData.append("cloud_name","------");
     const data= await (await fetch(/*url for fetching image*/{
          method:'POST',
          body:formData
        }))
        data.json()
        .then(data=>{
            console.log(data)
         localStorage.setItem("user",JSON.stringify({...state1,image:data.url}))
         dispatch({type:"UPDATEPIC",payload:data.url})
         //const la=data.url
         var config = {
          method: 'put',
          url: 'http://localhost:5000/updatepic',
          headers:{
              "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            data:{
              image:data.url
          }
        };
        axios(config)
       .then(result=>{
           console.log(result)
       })
       .catch(err=>{
           console.log(err)
       }) 
         window.location.reload()
        })
        .catch(err=>{
          console.log(err)
        })
      }
    return(
        <div>
            <div style={{width:"500px",marginLeft:"300px",height:"200px"}}>
            <div style={{marginTop:"20px",marginLeft:"30px",width:"170px",float:"left"}}>
            <img  alt="" src={state1.image} style={{borderRadius:"80px",height:"160px",width:"160px"}}></img>
            <div class="file-field input-field" style={{marginLeft:"10px"}}>
      <div class="btn">
        <span>Select Image</span>
        <input type="file" onChange={(e)=>{setPic(e.target.files[0])}}/>
      </div>
      <div class="file-path-wrapper">
        <input class="file-path validate" type="text" />
      </div>
      <button class="btn waves-effect waves-light" style={{marginTop:"0px",marginLeft:"20px",width:"100px",height:"50px"}} onClick={()=>imageing()}>Upload
       </button>
    </div>
           </div>
            <div style={{float:"right",width:"250px",marginLeft:"50px",marginTop:"20px"}}>
             <h4>{state1.name}</h4>
             <h6 style={{float:"left",marginRight:"20px"}}>followers</h6><h6 style={{float:"left"}}>following</h6>
             <h6 style={{float:"left",marginLeft:"20px"}}>posts</h6>
             <h6 style={{float:"left",marginRight:"70px",marginLeft:"20px"}}>{state1.follower.length}</h6><h6 style={{float:"left"}}>{state1.following.length}</h6>
             <h6 style={{float:"left",marginLeft:"60px"}}>{pics.length}</h6>
            </div>
            </div>
            {   
            pics.map(item=>{
                return(
            <div style={{marginTop:"120px",marginLeft:"330px",maxWidth:"500px"}}>
            <img  alt={item.title} src={item.photo} style={{height:"160px",width:"160px",padding:"20px",float:"left"}}></img>
             </div>
            )})
            }
        </div>
    )
}
export default Profile;