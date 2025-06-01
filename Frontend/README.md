## ✅ Resuming Work After Exams

### ✨ Tasks Completed:

---

### 1. **Signup & Login Pages**

* Designed and implemented responsive UI for both **signup** and **login** forms.
* Integrated form inputs and structure to support authentication flow.

---

### 2. **Form Validation with Zod**

* Used **Zod** for schema-based form validation to ensure form data integrity before making API calls.
* Created reusable validation schemas for both signup and login inputs.

---

### 3. **Integration with React Hook Form**

* Installed `@hookform/resolvers/zod` to seamlessly integrate **Zod** with **React Hook Form**.
* Used the **Zod resolver** to validate form inputs in real-time and display validation errors on the UI.

---

### 4. **Authentication Flow using Redux Toolkit**

#### 📁 File Structure Highlights:

* `authSlice.js`: Contains the authentication state and async reducers.
* `axiosClient.js`: Configured Axios client with common settings like base URL and `withCredentials`.
* `store.js`: Global Redux store setup, registering `auth` slice.

---

#### 🔄 `createAsyncThunk` Overview:

* Handles API communication using Redux’s async functions.
* Automatically manages:

  * `pending` state (API call in progress)
  * `fulfilled` state (success)
  * `rejected` state (error)

---

#### 📦 Async Thunks Implemented:

* `registerUser`: `POST /user/register`
* `loginUser`: `POST /user/login`
* `checkAuth`: `GET /user/check`
* `logoutUser`: `POST /logout`

Each thunk handles response and error gracefully using:

```js
try {
  const res = await axiosClient.get/post(...);
  return res.data;
} catch (err) {
  return rejectWithValue(err);
}
```

---

### 5. **Auth Slice State Management**

```js
{
  user: "",              // Stores logged-in user info
  isAuthenticated: "",   // Tracks if user is logged in
  loading: "",           // API loading state
  error: ""              // Captures errors from API
}
```

#### Reducers with `.addCase()` handle:

* `pending`: Sets `loading = true`, clears errors.
* `fulfilled`: Sets `user`, `isAuthenticated`, and `loading = false`.
* `rejected`: Stores error, resets auth state.

**Why use `!!action.payload`?**

* Converts any value to boolean.
* Ensures `isAuthenticated` is always a boolean.

```js
isAuthenticated = !!action.payload;
```

---

### 6. **Axios Client Setup**

```js
const axiosClient = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json"
  }
});
```

* `withCredentials: true`: Enables secure cookie-based sessions.
* `baseURL`: Simplifies API request paths.

---

### 7. **Redux Store Setup**

```js
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});
```

* Registers `auth` slice globally.
* Enables use of `useSelector` and `useDispatch` in React components.

---

## 🔐 Protecting Tokens Against Postman or Script-Based Abuse

### ❗ Problem:

Even with **CORS**, if a token is stolen, it can be used via tools like Postman or curl — bypassing browser protections.

---

### 🔒 Secure Server-Side Strategies:

#### 1. **Bind Token to Client Context (IP, User-Agent)**

```js
if (storedIP !== requestIP || storedUA !== requestUserAgent) {
   reject("Suspicious token usage");
}
```

#### 2. **Use Short-Lived Access Tokens + Refresh Tokens**

* Access Token: Valid for 5–15 minutes.
* Refresh Token: Stored securely in **HttpOnly cookies**.

#### 3. **Geo/IP-Based Restrictions**

* Detect and block suspicious IP/location changes.

#### 4. **Token Revocation Mechanism**

* Maintain a blacklist of revoked tokens in DB or Redis.
* Revoke tokens on logout or suspicious activity.

#### 5. **Rate Limiting and Activity Monitoring**

* Apply limits on requests per IP/token.
* Monitor and alert abnormal patterns using services like Cloudflare or AWS WAF.

#### 6. **Secure Storage & HTTPS Only**

* Always use HTTPS to avoid token sniffing.
* Store tokens in **HttpOnly** cookies.
* Avoid `localStorage` for sensitive tokens.

---

## 💡 UX Enhancement: Avoiding Flash on Auth Check

### 🧪 Without `isLoading`

```
Page Loads → Show Login Page → Auth Check Finishes → Navigate to Home
                ↑                        ↑
                |                        |
         Flash appears before redirection
```

### ✅ With `isLoading`

```
Page Loads → Show Spinner → Auth Check Finishes → Show Home Page
                ↑                          ↑
                |                          |
        Clean & smooth user experience
```

---

## 🔭 Utility: Current Path Detection

```js
window.location.pathname;
```

* Returns the current route (e.g., `/login`, `/dashboard`).
* Useful for redirect checks or conditional rendering.
