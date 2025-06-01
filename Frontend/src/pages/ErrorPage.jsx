// src/pages/NotFound.jsx or src/components/NotFound.jsx

import React from "react";
import { Link } from "react-router"; // Only if using React Router

const NotFound = () => {
  return (
    <div
      className="flex flex-col items-center justify-center h-screen px-4"
      data-theme="dark"
    >
      <h1 className="text-9xl font-bold text-red-500">404</h1>
      <h2 className="text-3xl font-semibold text-white mt-4">
        Page Not Found
      </h2>
      <p className="text-white mt-2 text-center">
        Sorry, the page you're looking for doesn't exist or has been moved.
      </p>
      <Link
        to="/"
        className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
      >
        Go Home
      </Link>
    </div>
  );
};

export default NotFound;
