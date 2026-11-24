import { Navigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import { Loading } from '../components/Loading';

export function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuthContext();

  if (loading) {
    return <Loading />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
