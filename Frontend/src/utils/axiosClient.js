import axios from "axios";

const axiosClient = axios.create({
  baseURL: "/api",

  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

let loadingMessageTimeout;

// Function to show the loading message
const showLoadingMessage = () => {
  // Check if the message already exists
  if (document.getElementById("backend-loading-message")) {
    return;
  }
  const messageElement = document.createElement("div");
  messageElement.id = "backend-loading-message";
  messageElement.style.position = "fixed";
  messageElement.style.top = "50%";
  messageElement.style.left = "50%";
  messageElement.style.transform = "translate(-50%, -50%)";
  messageElement.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
  messageElement.style.color = "white";
  messageElement.style.padding = "20px";
  messageElement.style.borderRadius = "10px";
  messageElement.style.zIndex = "9999";
  messageElement.innerText = "Backend is starting, please wait...";
  document.body.appendChild(messageElement);
};

// Function to hide the loading message
const hideLoadingMessage = () => {
  const messageElement = document.getElementById("backend-loading-message");
  if (messageElement) {
    document.body.removeChild(messageElement);
  }
};

// Request interceptor
axiosClient.interceptors.request.use(
  (config) => {
    // Clear any existing timeout
    if (loadingMessageTimeout) {
      clearTimeout(loadingMessageTimeout);
    }

    // Set a timeout to show the loading message
    loadingMessageTimeout = setTimeout(showLoadingMessage, 5000); // 5 seconds

    return config;
  },
  (error) => {
    clearTimeout(loadingMessageTimeout);
    return Promise.reject(error);
  }
);

// Response interceptor
axiosClient.interceptors.response.use(
  (response) => {
    // Clear the timeout and hide the message on successful response
    clearTimeout(loadingMessageTimeout);
    hideLoadingMessage();
    return response;
  },
  async (error) => {
    // Clear the timeout and hide the message on error
    clearTimeout(loadingMessageTimeout);
    hideLoadingMessage();

    const { config, response } = error;
    const originalRequest = config;

    // Retry on network error or 5xx errors, which can happen on cold starts
    if (
      response &&
      response.status >= 500 &&
      originalRequest &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      const retryCount = originalRequest.retryCount || 0;
      if (retryCount < 3) {
        // Retry up to 3 times
        originalRequest.retryCount = retryCount + 1;
        const delay = Math.pow(2, retryCount) * 1000; // Exponential backoff
        console.log(`Request failed, retrying in ${delay}ms...`);
        return new Promise((resolve) =>
          setTimeout(() => resolve(axiosClient(originalRequest)), delay)
        );
      }
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
