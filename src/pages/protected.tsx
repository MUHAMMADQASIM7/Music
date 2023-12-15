import { Navigate, Outlet } from "react-router-dom";    

const ProtectedRoutes = () => {

    const token:any =  sessionStorage.getItem("data");
    const data = JSON.parse(token)
    
    if(data){
        return <Outlet/>
        
    }
    else{
      return  <Navigate to={"/Sign-in"}/>;
    }
    
} ;

export default ProtectedRoutes;