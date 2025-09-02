import React, { createContext, useState } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userPhone, setUserPhone] = useState("");

  return (
    <UserContext.Provider value={{ userPhone, setUserPhone }}>
      {children}
    </UserContext.Provider>
  );
};