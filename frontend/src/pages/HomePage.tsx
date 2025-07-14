import React, { useState } from 'react';
import FileUpload from '../components/Files/FileUpload';
import FileList from '../components/Files/FileList';
import { useAuth } from '../context/AuthContext';
import { uploadFile } from '../api';

const HomePage: React.FC = () => {
  const { user, logout } = useAuth();
  const [refetchTrigger, setRefetchTrigger] = useState(0);

  const handleUpload = async (file: File) => {
    try {
      await uploadFile(file);
      setRefetchTrigger(prev => prev + 1);
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10">
      <header className="mb-8 w-full max-w-3xl flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Typeface File Vault
          </h1>
          <p className="text-gray-500 mt-2 text-base">
            A minimalistic Dropbox-like app for your files
          </p>
        </div>
        {user && (
          <div className="flex items-center space-x-4">
            <span className="text-gray-700 font-medium">Welcome, {user.name || user.email}!</span>
            <button
              onClick={logout}
              className="px-3 py-1 rounded-md bg-red-500 text-white text-sm font-medium hover:bg-red-600 focus:outline-none"
            >
              Logout
            </button>
          </div>
        )}
      </header>
      <main className="w-full max-w-3xl grid grid-cols-1 md:grid-cols-2 gap-8">
        <FileUpload onUpload={handleUpload} />
        <FileList refetchTrigger={refetchTrigger} />
      </main>
    </div>
  );
};

export default HomePage;
