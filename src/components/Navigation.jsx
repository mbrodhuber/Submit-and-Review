import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from "./ui/button";

const Navigation = () => {
  const { user, signOut } = useAuth();

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">Content Submission System</Link>
        <div>
          {user ? (
            <>
              <Link to="/dashboard" className="mr-4">Dashboard</Link>
              <Link to="/submit" className="mr-4">Submit Content</Link>
              {(user.role === 'reviewer' || user.role === 'admin') && (
                <Link to="/review" className="mr-4">Review</Link>
              )}
              {user.role === 'admin' && (
                <Link to="/admin" className="mr-4">Admin</Link>
              )}
              <Button onClick={signOut}>Sign Out</Button>
            </>
          ) : (
            <>
              <Link to="/login" className="mr-4">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;