import React,{createContext,useReducer,useEffect,useContext} from 'react';
import './App.css';
import Navbar from './components/navbar';
import {BrowserRouter,Route,Switch, useHistory} from 'react-router-dom';
import Home from './components/home';
import Profile from './components/profile';
import Signin from './components/signin';
import Signup from './components/signup';
import Createpost from './components/createpost';
import Followingpost from './components/myfollowing';
import UserProfile from './components/userprofile';
import {reducer,initialState} from './reducers/reducer';
export const UserContext=createContext()
const Routing=()=>{
  const history=useHistory();
  const {state,dispatch}=useContext(UserContext);
  useEffect(() => {
  const user=JSON.parse(localStorage.getItem("user"))
  console.log(typeof(user))
  if(user)
  {
    dispatch({type:"USER",payload:user})
  }
  else
  {
    history.push('/signin')
  }  
  },[])
  return(
    <Switch>
    <Route exact path='/' ><Home /></Route>
    <Route exact path='/profile' ><Profile /></Route>
    <Route exact path='/profile/:userid' ><UserProfile /></Route>
    <Route path='/signin' ><Signin /></Route>
    <Route path='/signup' ><Signup /></Route>
    <Route path='/createpost' ><Createpost /></Route>
    <Route path='/myfollowingpost' ><Followingpost /></Route>
    </Switch>
  )}
function App() { 
  const [state,dispatch]=useReducer(reducer,initialState)
  return (
    <UserContext.Provider value={{state,dispatch}}>
    <BrowserRouter>
    <Navbar />
    <Routing />
    </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
