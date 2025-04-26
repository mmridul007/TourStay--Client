import { useContext, useState, useEffect } from "react";
import "./login.css";
import { AuthContext } from "../../components/context/AuthContext";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

const Login = () => {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [formError, setFormError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [returnUrl, setReturnUrl] = useState("/");
  
  const navigate = useNavigate();
  const location = useLocation();
  const { loading, error, dispatch } = useContext(AuthContext);

  useEffect(() => {
    // Check if there's a returnUrl in the state or query parameters
    const params = new URLSearchParams(location.search);
    const returnPath = location.state?.returnUrl || params.get("returnUrl") || "/";
    setReturnUrl(returnPath);
  }, [location]);

  const handleChange = (e) => {
    setCredentials((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleClick = async (e) => {
    e.preventDefault();
    setFormError("");
    setSuccessMessage("");

    // Validation
    if (!credentials.username || !credentials.password) {
      setFormError("Username and password are required.");
      return;
    }

    dispatch({ type: "LOGIN_START" });

    try {
      const res = await axios.post(
        "http://localhost:4000/api/auth/login",
        credentials,
        {
          withCredentials: true,
        }
      );

      dispatch({ type: "LOGIN_SUCCESS", payload: res.data.details });
      setSuccessMessage(`Login successful! Redirecting...`);
      
      // Redirect after successful login to the page they were coming from
      setTimeout(() => {
        navigate(returnUrl);
      }, 1500);
    } catch (err) {
      dispatch({
        type: "LOGIN_FAILURE",
        payload: err.response?.data || "Something went wrong",
      });
      setSuccessMessage(""); // Clear success message on error
    }
  };

  return (
    <div className="login">
      <h2 className="loginTitle">Login</h2>
      <div className="lContainer">
        <img
          src="https://res.cloudinary.com/dkkdfz2n0/image/upload/v1739601631/Screenshot_2025-02-15_at_12.35.55_PM_opxr4x.png"
          alt="Tour Stay Logo"
        />
        <label>Username </label>
        <input
          type="text"
          name="username"
          onChange={handleChange}
          id="username"
          placeholder="Username"
          className="lInput"
        />
        <label>Password </label>
        <input
          type="password"
          name="password"
          onChange={handleChange}
          id="password"
          placeholder="Password"
          className="lInput"
        />
        <button disabled={loading} className="lButton" onClick={handleClick}>
          {loading ? "Logging in..." : "Login"}
        </button>
        {formError && <span className="formError">{formError}</span>}
        {error && <span className="errorMessage">{error.message}</span>}
        {successMessage && (
          <span className="successMessage">{successMessage}</span>
        )}
        {returnUrl !== "/" && (
          <p className="returnInfo"></p>
        )}
      </div>
    </div>
  );
};

export default Login;