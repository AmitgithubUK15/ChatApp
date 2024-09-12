import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useSelector } from "react-redux";
import React, { Suspense } from "react";

// Lazy-loaded components
const Home = React.lazy(() => import("./pages/Home"));
const Login = React.lazy(() => import("./pages/Login"));
const Chat = React.lazy(() => import("./pages/Chat"));
const UserAccountList = React.lazy(() => import("./pages/UserAccountList"));
const Account = React.lazy(() => import("./pages/Account"));
const SideNav = React.lazy(() => import("./components/SideNav"));
const PrivateRoute = React.lazy(() => import("./components/PrivateRoute"));

function App() {
  const { S_UID } = useSelector((state) => state.user);
  return (
    <BrowserRouter>
      {S_UID !== null && (
        <Suspense fallback={<div>Loading SideNav...</div>}>
          <SideNav />
        </Suspense>
      )}

      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />

          {/* Protected Routes */}
          <Route element={<PrivateRoute />}>
            <Route path="/rooms/*" element={<Chat />} />
            <Route path="/Adduser/*" element={<UserAccountList />} />
            <Route path="/account" element={<Account />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
