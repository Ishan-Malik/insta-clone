import React,{useContext,useRef,useEffect, useState} from 'react';
import {Link,useHistory} from 'react-router-dom';
import {UserContext} from '../App';
import M from 'materialize-css';
import axios from 'axios';

const Navbar=()=>{
  const {state,dispatch}=useContext(UserContext);
  const state1=JSON.parse(localStorage.getItem("user"));
  console.log(state1)
  const history=useHistory()
  const searchmodal=useRef(null)
  const [search,setSearch]=useState("")
  const [searches,setSearchs]=useState([]);
useEffect(() => {
 M.Modal.init(searchmodal.current)
}, [])
  const Ready=()=>{
    if(state)
    {
      return[
        <li><i className="material-icons modal-trigger" data-target="modal1" style={{color:"black"}}>search</i></li>,
        <li><Link to='/profile'>Profile</Link></li>,
      <li><Link to='/createpost'>Createpost</Link></li>,
      <li><Link to='/myfollowingpost'>FollowingPost</Link></li>,
        <li>
          <button class="btn waves-effect waves-light #e53935 red darken-1" 
          onClick={()=>{
          localStorage.clear()
          dispatch({type:'CLEAR'})
          history.push('/signin')
          }}>logout</button>
      </li> 
      ]
    }
    else
    {
      return[
        <li><Link to='/signup'>Signup</Link></li>,
        <li><Link to='/signin'>Signin</Link></li>
      ]
    }
  }
  const fetchUser=(rock)=>{
   setSearch(rock)
   var config = {
    method: 'post',
    url: `http://localhost:5000/searchuser`,
    data:{
      query:rock
  }
  };
  axios(config)
 .then(result=>{
    setSearchs(result.data.user)
 })
 .catch(err=>{
     console.log(err)
 }) 
  }
    return(
    <nav>
<div className="nav-wrapper white">
  <Link to={state?'/':'/signin'} className="brand-logo">Instagram</Link>
  <ul id="nav-mobile" className="right hide-on-med-and-down">
  {Ready()}
  </ul>
  </div>
  <div id="modal1" class="modal" ref={searchmodal} style={{color:"black"}}>
    <div class="modal-content" style={{color:"black"}}>
    <input type="text" placeholder="Search-users" value={search} onChange={(e)=>fetchUser(e.target.value)} />
    <ul className="collection">
     {
       state1?
       searches.map(item=>{
         return(
          <Link to={state1._id===item._id?'/profile':'/profile/'+item._id} onClick={
            ()=>{M.Modal.getInstance(searchmodal.current).close();
            setSearch('')}
          }><li class="collection-item">{item.email}</li></Link>
         )
       })
       :"loding"
     }
    </ul>
    </div>
    <div class="modal-footer">
      <button class="modal-close waves-effect waves-green btn-flat" onClick={()=>setSearch('')}>close</button>
    </div>
  </div>
</nav>
    )}
export default Navbar;
    