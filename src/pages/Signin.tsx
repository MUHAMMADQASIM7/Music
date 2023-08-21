import React, { useState} from "react";
import { onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { Link, useNavigate } from "react-router-dom";
import './style.css'


const Signin = () => {

    const [err, setErr] = useState(false);
    const navigate = useNavigate();
  
    const handleSubmit = async (e:any) => {
      e.preventDefault();
      const email = e.target[0].value;
      const password = e.target[1].value;
  
      try {
        await signInWithEmailAndPassword(auth, email, password);
        onAuthStateChanged(auth, (user) => {
          if (user) {
            console.log("User is: ",user);
            // const uid = user.uid;
            // setData(user)
            sessionStorage.setItem("data", JSON.stringify(user));

            // console.log(data)
          } 
        });
        navigate("/Main-page")
        // dispatch(setAuth(true))
      } catch (err) {
        setErr(true);
      }
    };
    return (
      <div className="formContainer">
        <div className="formWrapper">
          <span className="logo">Music</span>
          <span className="title">Login</span>
          <form className="forum" onSubmit={handleSubmit}>
            <input type="email" name="email"  placeholder="email" />
            <input type="password" name="password" placeholder="password" />
            <button>Sign in</button>
            {err && <span>Something went wrong</span>}
          </form>
          <p>You don't have an account? <Link to="/Sign-up">Register</Link></p>
        </div>
      </div>
    );
  };
  

  export default Signin;  