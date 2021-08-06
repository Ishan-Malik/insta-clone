import React,{useState,useEffect,useContext} from 'react';
import axios from 'axios';
import {UserContext} from '../App';
import {Link} from 'react-router-dom';
const Followingpost=()=>{
    const [data,setData]=useState([]);
    const state=JSON.parse(localStorage.getItem("user"))
    console.log(state)
    useEffect(() => {
        var config = {
            method: 'GET',
            url: 'http://localhost:5000/getsubpost',
            headers:{
                "Authorization":"Bearer "+localStorage.getItem("jwt")
              }
          };
          axios(config)
         .then(result=>{
             console.log(result)
             setData(result.data.result)
         })
         .catch(err=>{
             console.log(err)
         }) 
    }, [])
    const likePost=(id)=>{
        var config = {
            method: 'PUT',
            url: 'http://localhost:5000/like',
            headers:{
                "Authorization":"Bearer "+localStorage.getItem("jwt")
              },
              data:{
                  postId:id
              }
          };
          axios(config)
         .then(result=>{
           const newData=data.map(item=>{
               if(result.data._id===item._id)
               {
                   return result.data
               }
               else
               {
                   return item
               }
           })
           setData(newData)  
         })
         .catch(err=>{
             console.log(err)
         }) 
        }
         const unlikePost=(id)=>{
            var config = {
                method: 'PUT',
                url: 'http://localhost:5000/unlike',
                headers:{
                    "Authorization":"Bearer "+localStorage.getItem("jwt")
                  },
                  data:{
                      postId:id
                  }
              };
              axios(config)
             .then(result=>{
               const newData=data.map(item=>{
                    if(result.data._id===item._id)
                    {
                        return result.data
                    }
                    else
                    {
                        return item
                    }
                })
                setData(newData) 
             })
             .catch(err=>{
                 console.log(err)
             }) 
    }
    
    const commentPost=(text,id)=>{
        var config = {
            method: 'PUT',
            url: 'http://localhost:5000/comment',
            headers:{
                "Authorization":"Bearer "+localStorage.getItem("jwt")
              },
              data:{
                  text:text,
                  postId:id
              }
          };
          axios(config)
         .then(result=>{
             console.log(result)
           const newData=data.map(item=>{
               if(result.data._id===item._id)
               {
                   return result.data
               }
               else
               {
                   return item
               }
           })
           setData(newData)  
         })
         .catch(err=>{
             console.log(err)
         }) 
        }
        const deletePost=(postId)=>{
            var config = {
                method: 'delete',
                url: `http://localhost:5000/deletepost/${postId}`,
                headers:{
                    "Authorization":"Bearer "+localStorage.getItem("jwt")
                  }
              };
              axios(config)
             .then(result=>{
                const newData=data.filter((item)=>{
                  return item._id!==result.data._id
             })
                setData(newData)
             })
             .catch(err=>{
                 console.log(err)
             }) 
            }
    return(
        <div style={{marginLeft:"250px"}}>
           {
           data.map(item=>{
            return(
                
                <div classname='card home-card'>
             <h4><Link to={item.postedby._id===state._id?'/profile':'/profile/'+item.postedby._id}>{item.postedby.name}</Link></h4>&nbsp;{item.postedby._id===state._id?<i class="material-icons" style={{color:"black",float:"right"}} onClick={()=>{deletePost(item._id)}}>delete</i>:<p></p>}
             <div classname="class-image" style={{maxwidth:"300px"}}>
              <img alt="" src={item.photo} style={{width:"300px"}}></img>
                 <br></br>
                 <h7>{item.likes.length} likes</h7>
                 <br></br>
                 <h7>{item.title}</h7>
                 <br></br>
                 <h7>{item.body}</h7>
                 <br></br>
                 
                 <br></br>
             <i class="material-icons" style={{color:"red"}}>favorite</i>
             {item.likes.includes(state._id)
             ?<i class="material-icons" style={{color:"black"}} onClick={()=>{unlikePost(item._id)}}>thumb_down</i>:
             <i class="material-icons" style={{color:"black"}} onClick={()=>{likePost(item._id)}}>thumb_up</i>
             }
             <br></br>
             {
                   item.comments.map(comment=>{
                         return(
                             <h6><span style={{fontWeight:"500",color:"green"}}>{comment.postedby.name}</span>{comment.text}</h6>
                             )
                     })
                 }
               <form onSubmit={(e)=>{
                   e.preventDefault() 
                   commentPost(e.target[0].value,item._id)}}>
                <input type="text" placeholder="write a comment" style={{width:"400px"}}></input>
                </form>
                </div>
                </div>
               )})
            }
            </div>
    )
}
export default Followingpost;