import { Navigate } from 'react-router-dom';
import { AuthContext } from '../Providers/AuthProvider';
import { useContext } from 'react';

const PrivateRoute = ({children}) => {
  const {user, loading} = useContext(AuthContext);

  if(loading){
    return <span className="loading loading-bars loading-lg"></span>
  }

  if(user?.email){
    return children
  }
  return <Navigate to={'/login'}></Navigate>
};

export default PrivateRoute;