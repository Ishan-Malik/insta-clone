import React,{useEffect,useState,useContext} from 'react';
import axios from 'axios';
import {UserContext} from '../App';
import {useParams} from 'react-router-dom'
const UserProfile=()=>{
    const{state,dispatch}=useContext(UserContext);
    const state1=JSON.parse(localStorage.getItem("user"));
    const [userprofile,setuserprofile]=useState(null);
    const {userid}=useParams()
    const [userpro,setuserpro]=useState(state1?!state1.following.includes(userid):true);
    console.log(userid)
    useEffect(() => {
        var config = {
            method: 'GET',
            url: `http://localhost:5000/user/${userid}`,
            headers:{
                "Authorization":"Bearer "+localStorage.getItem("jwt")
              }
          };
          axios(config)
         .then(result=>{
            console.log(result)
            setuserprofile(result.data)
         })
         .catch(err=>{
             console.log(err)
         }) 
    }, [])
    const follow=()=>{
        var config = {
            method: 'PUT',
            url: 'http://localhost:5000/follow',
            headers:{
                "Authorization":"Bearer "+localStorage.getItem("jwt")
              },
              data:{
                 followId:userid
              }
          };
          axios(config)
         .then(result=>{
             console.log(result)
             dispatch({type:"UPDATE",payload:{follower:result.data.follower,following:result.data.following}})
            localStorage.setItem("user",JSON.stringify(result.data))     
            setuserprofile(prevstate=>{
             return{
                 ...prevstate,
                 user:{
                     ...prevstate.user,
                     follower:[...prevstate.user.follower,result.data._id]
                 }
             }
            })  
            setuserpro(false)  
            })
         .catch(err=>{
             console.log(err)
         }) 
    }
    
    const unfollow=()=>{
        var config = {
            method: 'PUT',
            url: 'http://localhost:5000/unfollow',
            headers:{
                "Authorization":"Bearer "+localStorage.getItem("jwt")
              },
              data:{
                 followId:userid
              }
          };
          axios(config)
         .then(result=>{
            console.log(result)
            dispatch({type:"UPDATE",payload:{follower:result.data.follower,following:result.data.following}})
           localStorage.setItem("user",JSON.stringify(result.data))     
           setuserprofile(prevstate=>{
            const newfollower=prevstate.user.follower.filter(item=>item!==result.data._id)
            return{
                ...prevstate,
                user:{
                    ...prevstate.user,
                    follower:newfollower
                }
            }
           }) 
           setuserpro(true)     
         })
         .catch(err=>{
             console.log(err)
         }) 
    }
    return(
            <>
            {userprofile?<div>
            <div style={{width:"500px",marginLeft:"300px",height:"200px"}}>
           <div style={{marginTop:"20px",marginLeft:"30px",width:"170px",float:"left"}}>
           <img  alt="" src={userprofile.user.image} style={{borderRadius:"80px",height:"160px",width:"160px"}}></img>
          </div>
           <div style={{float:"right",width:"250px",marginLeft:"50px",marginTop:"20px"}}>
            <h4>{userprofile.user.name}</h4>
            <br></br>
            <h6>{userprofile.user.email}</h6>
            <h6 style={{float:"left",marginRight:"20px"}}>followers</h6><h6 style={{float:"left"}}>following</h6>
            <h6 style={{float:"left",marginLeft:"20px"}}>posts</h6>
            <h6 style={{float:"left",marginRight:"70px",marginLeft:"20px"}}>{userprofile.user.follower.length}</h6><h6 style={{float:"left"}}>{userprofile.user.following.length}</h6>
            <h6 style={{float:"left",marginLeft:"60px"}}>{userprofile.result.length}</h6>
            {
                userpro?
                <button class="btn waves-effect waves-light #e53935 blue darken-1" 
            onClick={()=>{follow()}}
            >Follow</button>
            :
            <button class="btn waves-effect waves-light #e53935 blue darken-1" 
            onClick={()=>{unfollow()}}
            >Unfollow</button>
            }
           </div>
           </div>
           {   
           userprofile.result.map(item=>{
               return(
           <div style={{marginTop:"70px",marginLeft:"350px",maxWidth:"500px"}}>
           <img  alt={item.title} src={item.photo} style={{height:"160px",width:"160px",padding:"20px",float:"left"}}></img>
            </div>
           )})
           }
       </div>:"loading"
        }
        </>
    )
}
export default UserProfile;