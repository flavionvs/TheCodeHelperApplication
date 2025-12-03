// WalletContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import { apiRequest } from './api';

const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
  const [walletAmount, setWalletAmount] = useState(null);
  const [image, setImage] = useState(null);
  const [name, setName] = useState(null);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");
  const user_id = localStorage.getItem("user_id")
  ? JSON.parse(localStorage.getItem("user_id"))
  : null;
const user = localStorage.getItem(`user_${user_id}`)
  ? JSON.parse(localStorage.getItem(`user_${user_id}`))
  : {};
  const fetchWalletAmount = async (currentPage) => {
    try {
      const response = await apiRequest(
        "GET",
        `/wallet-balance`,
        null,
        {
          Authorization: `Bearer ${token}`,
        }
      );
      if (response.data?.status) {        
        setWalletAmount(response.data?.balance); // assuming this shape
      } else {
        toast.error("Failed to fetch projects");
      }
    } catch (error) {
      toast.error("Error loading projects");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchWalletAmount();
  }, []);
  useEffect(() => {
    setImage(user.image);
    setName(user.name);
  }, []);

  return (
    <WalletContext.Provider value={{ name, image, walletAmount, setWalletAmount, fetchWalletAmount }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => useContext(WalletContext);
