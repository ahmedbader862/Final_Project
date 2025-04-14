import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { auth } from '../../firebase/firebase'; // Adjust path to your Firebase config
import { onAuthStateChanged } from 'firebase/auth';

const ProtectedRoute = ({ element: Component, isAdminRoute = false, ...rest }) => {
  const userState = useSelector((state) => state.UserData['UserState']);
  const [loading, setLoading] = useState(true);
  const [firebaseUser, setFirebaseUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setFirebaseUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div className="text-center text-white">Loading...</div>; // Or a spinner
  }

  const isAuthenticated = firebaseUser && firebaseUser.uid && firebaseUser.uid !== "who know";
  const isAdmin = isAuthenticated && userState?.role === 'admin'; // Use optional chaining for safety

  if (isAdminRoute) {
    return isAuthenticated && isAdmin ? <Component {...rest} /> : <Navigate to="/signin" />;
  }

  return isAuthenticated ? <Component {...rest} /> : <Navigate to="/signin" />;
};

export default ProtectedRoute;