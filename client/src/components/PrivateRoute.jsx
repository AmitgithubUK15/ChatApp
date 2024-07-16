import { useSelector } from "react-redux";
import { Outlet,Navigate } from "react-router-dom";


export default function PrivateRoute() {

  const {S_UID} = useSelector((state)=>state.user)  
  return S_UID !== null? <Outlet /> : <Navigate to="/login" />
}
