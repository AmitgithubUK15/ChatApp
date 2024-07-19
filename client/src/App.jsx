import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Chat from "./pages/Chat";
import PrivateRoute from "./components/PrivateRoute";
import SideNav from "./components/SideNav";
import { useSelector } from "react-redux";
import UserAccountList from "./pages/UserAccountList";
import Account from "./pages/Account";
import Setting from "./pages/Setting";




function App() {
  const {S_UID} = useSelector((state)=>state.user);
  return (
    <BrowserRouter>
     
      {S_UID  ? (<SideNav />) : null}

      <Routes>
         <Route path="/" element={<Home />} />  
         <Route path="/login" element={<Login />} />  
         
         <Route element={<PrivateRoute />} >
         <Route path="/rooms" element={<Chat />} />
         <Route path="/Adduser/*" element={<UserAccountList />} />
         <Route path="/account" element={<Account />} />
         <Route path="/settings" element={<Setting />} />
         </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
