import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const Profile = () => {
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { authToken, logout } = useContext(AuthContext);

    useEffect(() => {
        const fetchProfileData = async () => {
            setLoading(true);
            setError('');

            if (!authToken) {
                logout(); // Clear auth state if token is invalid or missing
                navigate('/login');
                return;
            }

            try {
                const response = await axios.get('http://localhost:5000/profile', {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                    },
                });
                setProfileData(response.data);
            } catch (error) {
                setError('Failed to load profile data. Please try again later.');
                logout()
            } finally {
                setLoading(false);
            }
        };

        fetchProfileData();
    }, [authToken, logout, navigate]);

    const handleLogout = () => {
        logout(); // Use AuthContext's logout method
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gray-100 p-10">
            <header className="flex justify-between items-center mb-10">
                <h1 className="text-3xl font-bold text-blue-600">Profile</h1>
                <button
                    onClick={handleLogout}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                    Logout
                </button>
            </header>
            {loading ? (
                <p className="text-center text-gray-600">Loading...</p>
            ) : error ? (
                <p className="text-center text-red-500">{error}</p>
            ) : (
                <div className="bg-white p-6 rounded shadow-md max-w-md mx-auto">
                    <h2 className="text-2xl font-semibold mb-4">User Profile</h2>
                    {profileData ? (
                        <div>
                            <p className="mb-2">
                                <span className="font-bold">Username:</span> {profileData.username}
                            </p>
                            <p className="mb-2">
                                <span className="font-bold">Email:</span> {profileData.email}
                            </p>
                            <p className="mb-2">
                                <span className="font-bold">Verified:</span> {profileData.is_verified ? 'Yes' : 'No'}
                            </p>
                        </div>
                    ) : (
                        <p>No profile data available.</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default Profile;
