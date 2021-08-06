import React,{useState,useContext} from 'react';
import {Link,useHistory} from 'react-router-dom';
import M from 'materialize-css'
import {UserContext} from '../App';
var axios = require('axios');
const Signin=()=>{
   const {state,dispatch}=useContext(UserContext);
    const [password,setPassword]=useState("");
    const [email,setEmail]=useState("");
    const history=useHistory();
    const Postdata=()=>{
        if(!/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email))
        {
           return(
              M.toast({html:"enter valid email",classes:"#c62828 red darken-3"}) 
           )
        }
    var config = {
      method: 'POST',
      url: 'http://localhost:5000/signin',
      data: {
          email,
          password
        },
    };
    
    axios(config)
    .then(function (response) {    
      if(response.data==="message:enter email or password")
           {
               response.data="enter email or password"
          M.toast({html:response.data,classes:"#c62828 red darken-3"})
           } 
           else if(response.data==="message:invalid login")
           {
              response.data="invalid login"
              M.toast({html:response.data,classes:"#c62828 red darken-1"})  
           }
           else
           {
            console.log(response)
            const lp=JSON.stringify(response.data)
            localStorage.setItem("jwt",response.data.token)
            localStorage.setItem("user",lp)
            dispatch({type:"USER",payload:lp})
              M.toast({html:"signedin",classes:"#43a047 green darken-1"})  
              history.push('/')
           }
      })
    .catch(function (error) {
      console.log(error);
    });
  }
    return(
        <div className="mycard">
        <div className="card auth-card">
        <h2>Instagram</h2>
        <input type="text" placeholder="email" value={email} onChange={(e)=>setEmail(e.target.value)} />
        <input type="password" placeholder="password" value={password} onChange={(e)=>setPassword(e.target.value)} />
        <button class="btn waves-effect waves-light" style={{marginTop:10}} onClick={()=>{Postdata()}}>Signin
       </button>
       <br></br>
       <br></br>
       <Link to='/signup'>not have account?</Link>
        </div>
        </div>
    )
}
export default Signin;