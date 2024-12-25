import React, { useState } from "react";

export const AuthContext = React.createContext(undefined);

export const AuthProvider = ({ children }) => {
  const user = localStorage.getItem("user") || '{}';
  console.log(user);
  const localStorageUser = JSON.parse(user);
  const [currentUser, setCurrentUser] = useState(localStorageUser);

  const updateUser = (newUser) => {
    console.log("called this update user");
    setCurrentUser(newUser);
    localStorage.setItem("user", JSON.stringify(newUser)); // Update localStorage when user changes
  };

  return (
    <AuthContext.Provider value={{ currentUser, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};
