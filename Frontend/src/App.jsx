import React, { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router";
import HomePage from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { useDispatch, useSelector } from "react-redux";
import { checkAuth } from "./features/auth/authSlice";
import NotFound from "./pages/ErrorPage";
import ShimmerHomepage from "./components/ShimmerHomepage";
import ProfilePage from "./pages/ProfilePage";
import AdminPanel from "./pages/AdminPanel";
import ProblemPage from "./pages/ProblemPage";
import LandingPage from "./pages/LandingPage";
import AdminVideo from "./components/AdminVideo";
import AdminUpload from "./components/AdminUpload";
const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { user, isAuthenticated, loading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  console.log("user", user);
  useEffect(() => {
    const checkUserAuth = async () => {
      await dispatch(checkAuth());
      setIsLoading(false);
    };

    checkUserAuth();
  }, [dispatch]);

  // Determine which loading component to show based on the current URL
  const getLoadingComponent = () => {
    const path = window.location.pathname;

    if (path === "/" || path === "") {
      return <ShimmerHomepage />;
    } else {
      // For login and signup, just show a simple loading indicator
      return (
        <div
          className="min-h-screen flex items-center justify-center bg-base-200"
          data-theme="dark"
        >
          <div className="text-center">
            <div className="loading loading-spinner loading-lg text-primary"></div>
            {/* <p className="mt-4 text-base-content">Loadi</p> */}
          </div>
        </div>
      );
    }
  };

  // Show appropriate loading component
  if (isLoading || loading) {
    return getLoadingComponent();
  }

  return (
    // <BrowserRouter>
    //   <Routes>
    //     <Route
    //       path="/"
    //       element={isAuthenticated ? <HomePage /> : <Navigate to="/login" />}
    //     />
    //     <Route
    //       path="/login"
    //       element={isAuthenticated ? <Navigate to="/" /> : <Login />}
    //     />
    //     <Route
    //       path="/signup"
    //       element={isAuthenticated ? <Navigate to="/" /> : <Signup />}
    //     />
    //     <Route
    //       path="/profile"
    //       element={isAuthenticated ? <ProfilePage /> : <Navigate to="/login" />}
    //     />
    //     <Route
    //       path="/admin"
    //       element={
    //         isAuthenticated && user?.role === "admin" ? (
    //           <AdminPanel></AdminPanel>
    //         ) : (
    //           <Navigate to="/"></Navigate>
    //         )
    //       }
    //     ></Route>
    //     <Route path="/problem/:problemId" element={<ProblemPage />}></Route>
    //     <Route path="*" element={<NotFound />} />
    //   </Routes>
    // </BrowserRouter>
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={isAuthenticated ? <HomePage /> : <LandingPage />}
        />
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/" /> : <Login />}
        />
        <Route
          path="/signup"
          element={isAuthenticated ? <Navigate to="/" /> : <Signup />}
        />
        <Route
          path="/profile"
          element={isAuthenticated ? <ProfilePage /> : <Navigate to="/login" />}
        />
        <Route
          path="/admin"
          element={
            isAuthenticated && user?.role === "admin" ? (
              <AdminPanel />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/problem/:problemId"
          element={isAuthenticated ? <ProblemPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/admin/video"
          element={
            isAuthenticated && user?.role === "admin" ? (
              <AdminVideo />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/admin/upload/:problemId"
          element={
            isAuthenticated && user?.role === "admin" ? (
              <AdminUpload />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
