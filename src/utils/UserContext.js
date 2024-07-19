import React, { createContext, useState, useContext } from 'react';

const UsernameContext = createContext();

export const UsernameProvider = ({ children }) => {
  const [username, setUsername] = useState('');
  const [xpPoints, setXpPoints] = useState(0);
  const [profilePicture, setProfilePicture] = useState(null); // New state for profile picture

  return (
    <UsernameContext.Provider value={{ username, setUsername, xpPoints, setXpPoints, profilePicture, setProfilePicture }}>
      {children}
    </UsernameContext.Provider>
  );
};

export const useUsername = () => useContext(UsernameContext);
