import React from 'react';
import { useSelector } from 'react-redux';

const Profile = () => {
  const { userInfo } = useSelector((state) => state.auth);

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Your Profile</h1>
      <div className="bg-white shadow rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
            <p><strong>Name:</strong> {userInfo?.name}</p>
            <p><strong>Email:</strong> {userInfo?.email}</p>
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-4">Account Details</h2>
            <p><strong>Member since:</strong> {new Date(userInfo?.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;