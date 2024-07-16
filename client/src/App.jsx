import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Chat from "./pages/Chat";
import PrivateRoute from "./components/PrivateRoute";


function App() {
  
  return (
    <BrowserRouter>
      <Routes>
         <Route path="/" element={<Home />} />  
         <Route path="/login" element={<Login />} />  
         
         <Route element={<PrivateRoute />} >
         <Route path="/chat" element={<Chat />} />
         </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
