import React from "react";
import { useSpring, animated } from "@react-spring/web";

const ShimmerAuth = ({ type = "login" }) => {
  const animationProps = useSpring({
    from: { opacity: 0, transform: "translateY(60px) scale(0.95)" },
    to: { opacity: 1, transform: "translateY(0) scale(1)" },
    config: { tension: 250, friction: 20 },
  });

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 bg-base-200"
      data-theme="dark"
    >
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <div className="h-10 w-40 bg-base-300 rounded animate-pulse mx-auto mb-2"></div>
          <div className="h-4 w-64 bg-base-300 rounded animate-pulse mx-auto"></div>
        </div>
        <animated.div
          style={animationProps}
          className="card bg-base-100 shadow-xl p-8 space-y-4"
        >
          {/* Form fields */}
          {type === "signup" && (
            <div>
              <div className="h-4 w-24 bg-base-300 rounded animate-pulse mb-2"></div>
              <div className="h-12 w-full bg-base-300 rounded animate-pulse"></div>
            </div>
          )}
          
          <div>
            {type === "signup" && (
              <div className="h-4 w-16 bg-base-300 rounded animate-pulse mb-2"></div>
            )}
            <div className="h-12 w-full bg-base-300 rounded animate-pulse"></div>
          </div>
          
          <div>
            {type === "signup" && (
              <div className="h-4 w-20 bg-base-300 rounded animate-pulse mb-2"></div>
            )}
            <div className="h-12 w-full bg-base-300 rounded animate-pulse"></div>
          </div>
          
          <div className="h-12 w-full bg-primary opacity-50 rounded animate-pulse"></div>
          
          <div className="text-center pt-4">
            <div className="h-4 w-48 bg-base-300 rounded animate-pulse mx-auto"></div>
          </div>
        </animated.div>
      </div>
    </div>
  );
};

export default ShimmerAuth;