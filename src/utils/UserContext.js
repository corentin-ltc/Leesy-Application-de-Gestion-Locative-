import React, { createContext, useState, useContext } from 'react';

const UsernameContext = createContext();

export const UsernameProvider = ({ children }) => {
  const [username, setUsername] = useState('');
  const [xpPoints, setXpPoints] = useState(0);

  return (
    <UsernameContext.Provider value={{ username, setUsername, xpPoints, setXpPoints }}>
      {children}
    </UsernameContext.Provider>
  );
};

export const useUsername = () => useContext(UsernameContext);
