import React, { Suspense } from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const Chat = React.lazy(() => import('./Chat'));
const Login = React.lazy(() => import('./Login'));

export default function Home() {
  const { S_UID } = useSelector((state) => state.user);

  return (
    <div>
      Home
      <Suspense fallback={<div>Loading...</div>}>
        {S_UID ? <Navigate to="/rooms" replace /> : <Navigate to="/login" replace />}
      </Suspense>
    </div>
  );
}
