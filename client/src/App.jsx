import { BrowserRouter, Route, Routes } from "react-router-dom";
// import Login from "./pages/Login";
// import PrivateRoute from "./components/PrivateRoute";
// import SideNav from "./components/SideNav";
import { useSelector } from "react-redux";
// import UserAccountList from "./pages/UserAccountList";
// import Account from "./pages/Account";
// import Setting from "./pages/Setting";
import React, { Suspense } from "react";
// import Chat from "./pages/Chat";

const Home = React.lazy(() => import("./pages/Home"));
const Login = React.lazy(() => import("./pages/Login"));
const Chat = React.lazy(() => import("./pages/Chat"));
const UserAccountList = React.lazy(() => import("./pages/UserAccountList"));
const Account = React.lazy(() => import("./pages/Account"));
const Setting = React.lazy(() => import("./pages/Setting"));
const SideNav = React.lazy(()=>import("./components/SideNav"))
const PrivateRoute = React.lazy(()=>import("./components/PrivateRoute"))

function App() {
  const { S_UID } = useSelector((state) => state.user);

  return (
    <BrowserRouter>
      {S_UID ? <Suspense fallback={<div>Loading..</div>}>
        <SideNav />
      </Suspense> : null}

      
        <Routes>
          <Route path="/" element={ <Suspense >
              <Home />
            </Suspense>} />
          <Route path="/login" element={
            <Suspense >
              <Login />
            </Suspense>
          } />
          
          <Route element={
            <Suspense fallback={<div>Loading...</div>}>
              <PrivateRoute />
            </Suspense>
          }>
            <Route path="/rooms/*" element={ <Suspense >
              <Chat />
            </Suspense>} />
            <Route path="/Adduser/*" element={<Suspense >
              <UserAccountList />
            </Suspense>} />
            <Route path="/account" element={<Suspense >
              <Account />
            </Suspense>} />
            <Route path="/settings" element={<Suspense >
              <Setting />
            </Suspense>} />
          </Route>
        </Routes>

    </BrowserRouter>
  );
}

export default App;
