# Frontend Documentation  

---

### **📅 Day 1: UI & Form Validation**  
**Focus**: Frontend implementation of authentication forms with validation.  

#### **Tasks Completed:**  
1. **Signup & Login Pages**  
   - Designed UI for both pages.  
   - Integrated form inputs and basic auth structure.  

2. **Zod Validation**  
   - Defined schemas for:  
     - Signup (e.g., email, password rules).  
     - Login (e.g., required fields).  
   - Ensured data correctness before API calls.  

3. **React Hook Form Integration**  
   - Used `@hookform/resolvers/zod` to link Zod with forms.  
   - Real-time validation + error display (e.g., "Invalid email").  

**Tech Used**:  
- React, Zod, React Hook Form.  

---

### **📅 Day 2: Redux Toolkit Authentication**  
**Focus**: Scalable state management for auth workflows.  

#### **Tasks Completed:**  
1. **Redux Toolkit Setup**  
   - Created `authSlice.js` with:  
     - Async thunks (`registerUser`, `loginUser`, `checkAuth`, `logoutUser`).  
     - State (`user`, `isAuthenticated`, `loading`, `error`).  

2. **API Integration with Axios**  
   - Configured `axiosClient.js` with:  
     - `baseURL: "http://localhost:3000"`.  
     - `withCredentials: true` (for cookies).  

3. **Async Logic**  
   - Handled API states (`pending/fulfilled/rejected`).  
   - Used `!!action.payload` to toggle `isAuthenticated`.  

4. **Store Configuration**  
   - Combined `authSlice` into Redux store (`store.js`).  

**Tech Used**:  
- Redux Toolkit (`createAsyncThunk`, `createSlice`), Axios.  

---

### ✅ **Day 3 - Completed User Authentication and Protected Routes**

**🔹 What I worked on:**

* Implemented full **user registration and login functionality** using Redux and React Hook Form with Zod for validation.
* Integrated proper **CORS setup** to allow cross-origin requests between frontend and backend.
* Used React Router to create **protected routes**, so that:

  * Authenticated users are redirected to the homepage.
  * Unauthenticated users are redirected to the login/signup page.
* Fixed a **backend/Frontend field mismatch** bug: `firstname` (frontend) vs `firstName` (backend controller).

**🔹 Technical Highlights:**

* Used `useDispatch`, `useSelector`, and `useNavigate` to manage state and navigation based on `isAuthenticated`.
* Utilized `useForm` and `zodResolver` to handle form input and validation.
* Set up protected routes using:

  ```jsx
  <Route path="/" element={isAuthenticated ? <Homepage /> : <Navigate to="/signup" />} />
  <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <Login />} />
  <Route path="/signup" element={isAuthenticated ? <Navigate to="/" /> : <Signup />} />
  ```
* Resolved CORS issues by properly configuring `cors()` in the backend with origin and credentials.

**🔹 Bugs Fixed:**

* 🐛 `firstname` mismatch fixed by updating both frontend and backend to use the same key.



---
