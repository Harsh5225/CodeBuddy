import React from "react";
import { logoutUser } from "../features/auth/authSlice";
import { useDispatch } from "react-redux";
import { clearMessages } from "../features/chatMessage/ChatSlice";

const Logout = () => {
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(clearMessages());
    dispatch(logoutUser());
  };

  return <a onClick={handleLogout}>Logout</a>;
};

export default Logout;
