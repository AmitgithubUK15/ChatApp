import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

export default function Home() {
  const { S_UID } = useSelector((state) => state.user);

  return (
    <div>
      Home
      {S_UID ? <Navigate to="/rooms" replace /> : <Navigate to="/login" replace />}
    </div>
  );
}
