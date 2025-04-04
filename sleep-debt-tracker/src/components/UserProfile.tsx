import { useState, useEffect } from 'react';
import { useAuth } from './auth-context';

const UserProfile = () => {
  interface User {
    userId: string;
  }

  const [user, setUser] = useState<User | null>(null);
  const { isAuthenticated, logout } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchUserData = async () => {
      try {
        const response = await fetch('http://localhost:5000/me', {
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data);
        } else {
          // logout();
          console.log('User not authenticated, logging out...');
        }
      } catch (error) {
        console.error('❌ Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [isAuthenticated, logout]);

  if (!isAuthenticated) {
    return <div className="text-text">Please log in to view your profile</div>;
  }

  return (
    <div className="bg-background text-text p-4 rounded-lg">
      {user ? (
        <div>
          <h2 className="text-xl font-semibold">Welcome, {user.userId}</h2>
          {/* Add more user information here */}
        </div>
      ) : (
        <div>Loading user data...</div>
      )}
    </div>
  );
};

export default UserProfile;