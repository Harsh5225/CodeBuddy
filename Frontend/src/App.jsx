/* eslint-disable no-unused-vars */
import React, { useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import HomePage from "./Home";
import Login from "./Login";
import Signup from "./Signup";
import { useDispatch, useSelector } from "react-redux";
import { checkAuth } from "./features/auth/authSlice";

const App = () => {
  let { isAuthenticated } = useSelector((state) => state.auth);
  console.log(isAuthenticated);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              isAuthenticated ? (
                <HomePage></HomePage>
              ) : (
                <Navigate to="/signup" />
              )
            }
          ></Route>
          <Route
            path="/login"
            element={isAuthenticated ? <Navigate to="/" /> : <Login></Login>}
          ></Route>
          <Route
            path="/signup"
            element={isAuthenticated ? <Navigate to="/" /> : <Signup></Signup>}
          ></Route>
        </Routes>
      </BrowserRouter>
      
    </div>
  );
};

export default App;
