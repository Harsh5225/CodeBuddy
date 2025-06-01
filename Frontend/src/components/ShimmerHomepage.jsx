import React from "react";

const ShimmerHomepage = () => {
  return (
    <div className="min-h-screen bg-base-200" data-theme="dark">
      {/* Navbar Shimmer */}
      <div className="navbar bg-base-100 shadow-lg">
        <div className="flex-1">
          <div className="h-8 w-40 bg-base-300 rounded animate-pulse"></div>
        </div>
        <div className="flex-none gap-2">
          <div className="w-10 h-10 rounded-full bg-base-300 animate-pulse"></div>
        </div>
      </div>

      {/* Main Content Shimmer */}
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Text Shimmer */}
        <div className="h-10 w-64 bg-base-300 rounded animate-pulse mb-6"></div>

        {/* Problem Categories Shimmer */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card bg-base-100 shadow-xl h-48">
              <div className="card-body">
                <div className="h-6 w-32 bg-base-300 rounded animate-pulse mb-4"></div>
                <div className="h-4 w-full bg-base-300 rounded animate-pulse mb-2"></div>
                <div className="h-4 w-3/4 bg-base-300 rounded animate-pulse mb-4"></div>
                <div className="card-actions justify-end">
                  <div className="h-8 w-20 bg-base-300 rounded animate-pulse"></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Problems Shimmer */}
        <div className="h-8 w-48 bg-base-300 rounded animate-pulse mb-4"></div>
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>
                  <div className="h-4 w-8 bg-base-300 rounded animate-pulse"></div>
                </th>
                <th>
                  <div className="h-4 w-20 bg-base-300 rounded animate-pulse"></div>
                </th>
                <th>
                  <div className="h-4 w-24 bg-base-300 rounded animate-pulse"></div>
                </th>
                <th>
                  <div className="h-4 w-16 bg-base-300 rounded animate-pulse"></div>
                </th>
                <th>
                  <div className="h-4 w-16 bg-base-300 rounded animate-pulse"></div>
                </th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3].map((i) => (
                <tr key={i}>
                  <td>
                    <div className="h-4 w-8 bg-base-300 rounded animate-pulse"></div>
                  </td>
                  <td>
                    <div className="h-4 w-32 bg-base-300 rounded animate-pulse"></div>
                  </td>
                  <td>
                    <div className="h-6 w-20 bg-base-300 rounded animate-pulse"></div>
                  </td>
                  <td>
                    <div className="h-4 w-20 bg-base-300 rounded animate-pulse"></div>
                  </td>
                  <td>
                    <div className="h-8 w-16 bg-base-300 rounded animate-pulse"></div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ShimmerHomepage;