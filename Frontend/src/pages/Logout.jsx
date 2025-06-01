import React from "react";
import { logoutUser } from "../features/auth/authSlice";
import { useDispatch } from "react-redux";

const Logout = () => {
  const dispatch = useDispatch();

  return <a onClick={() => dispatch(logoutUser())}>Logout</a>;
};

export default Logout;
