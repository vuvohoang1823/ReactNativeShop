import React, { createContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState([]);
  const [preview, setPreview] = useState([]);
  const [product, setProduct] = useState([]);
  //data global

  const fetchAllData = async () => {
    try {
      const response = await fetch(
        "https://6628249454afcabd0734fae0.mockapi.io/products"
      );
      const responsePre = await fetch(
        "https://6628249454afcabd0734fae0.mockapi.io/preview"
      );
      const responseProfile = await fetch(
        "https://662825f854afcabd0734fe61.mockapi.io/users"
      );

      if (response.ok) {
        const responseData = await response.json();
        setProduct(responseData);
      } else {
        console.error(`HTTP error Post! Status: ${response.status}`);
      }
      if (responsePre.ok) {
        const responseDataCmt = await responsePre.json();
        setPreview(responseDataCmt);
      } else {
        console.error(`HTTP error Comment! Status: ${responseCmt.status}`);
      }

      if (responseProfile.ok) {
        const responseDataProfile = await responseProfile.json();
        setUser(responseDataProfile);
      } else {
        console.error(`HTTP error Profile! Status: ${responseProfile.status}`);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        product,
        setProduct,
        preview,
        setPreview,
        fetchAllData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
