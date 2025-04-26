import { useState, useEffect } from "react";
import "./register.css";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    city: "",
    country: "Bangladesh", // Default country set to Bangladesh
    phone: "",
  });

  const [formErrors, setFormErrors] = useState({});
  const [touchedFields, setTouchedFields] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  const navigate = useNavigate();

  // Validate form whenever formData changes
  useEffect(() => {
    if (Object.keys(touchedFields).length > 0) {
      const validationErrors = validateForm(true);
      setFormErrors(validationErrors);
    }
  }, [formData, touchedFields]);

  const handleChange = (e) => {
    const { id, value } = e.target;

    setFormData((prev) => ({ ...prev, [id]: value }));

    // Mark this field as touched
    setTouchedFields((prev) => ({
      ...prev,
      [id]: true,
    }));
  };

  const handleBlur = (e) => {
    const { id } = e.target;

    // Mark this field as touched
    setTouchedFields((prev) => ({
      ...prev,
      [id]: true,
    }));
  };

  const validateForm = (partialValidation = false) => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10,15}$/;

    // Only validate touched fields if partialValidation is true
    if (!partialValidation || touchedFields.username) {
      if (!formData.username.trim()) {
        errors.username = "Username is required";
      } else if (formData.username.length < 3) {
        errors.username = "Username must be at least 3 characters";
      }
    }

    if (!partialValidation || touchedFields.email) {
      if (!formData.email.trim()) {
        errors.email = "Email is required";
      } else if (!emailRegex.test(formData.email)) {
        errors.email = "Please enter a valid email address";
      }
    }

    if (!partialValidation || touchedFields.password) {
      if (!formData.password) {
        errors.password = "Password is required";
      } else if (formData.password.length < 6) {
        errors.password = "Password must be at least 6 characters";
      }
    }

    if (
      !partialValidation ||
      touchedFields.confirmPassword ||
      touchedFields.password
    ) {
      if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = "Passwords do not match";
      }
    }

    if (!partialValidation || touchedFields.phone) {
      if (!formData.phone.trim()) {
        errors.phone = "Phone number is required";
      } else if (!phoneRegex.test(formData.phone)) {
        errors.phone = "Please enter a valid phone number";
      }
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Mark all fields as touched for full validation
    const allFieldsTouched = Object.keys(formData).reduce((acc, field) => {
      acc[field] = true;
      return acc;
    }, {});

    setTouchedFields(allFieldsTouched);

    // Run full validation
    const validationErrors = validateForm();
    setFormErrors(validationErrors);

    // If there are errors, don't submit
    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setLoading(true);
    setError(null);

    // Remove confirmPassword from the data sent to the server
    const { confirmPassword, ...dataToSubmit } = formData;

    try {
      await axios.post("http://localhost:4000/api/auth/register", dataToSubmit);

      setSuccessMessage("Registration successful! Redirecting to login...");

      // Redirect to login page after successful registration
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      setError(err.response?.data || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register">
      <h2 className="registerTitle">Create Account</h2>
      <div className="rContainer">
        <img
          src="https://res.cloudinary.com/dkkdfz2n0/image/upload/v1739601631/Screenshot_2025-02-15_at_12.35.55_PM_opxr4x.png"
          alt="Tour Stay Logo"
        />
        <form onSubmit={handleSubmit}>
          <div className="formGroup">
            <label htmlFor="username">
              Username <span className="required">*</span>
            </label>
            <input
              type="text"
              id="username"
              value={formData.username}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`rInput ${
                touchedFields.username && formErrors.username
                  ? "inputError"
                  : ""
              }`}
              placeholder="Enter username"
            />
            {touchedFields.username && formErrors.username && (
              <span className="errorText">{formErrors.username}</span>
            )}
          </div>

          <div className="formGroup">
            <label htmlFor="email">
              Email <span className="required">*</span>
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`rInput ${
                touchedFields.email && formErrors.email ? "inputError" : ""
              }`}
              placeholder="Enter email address"
            />
            {touchedFields.email && formErrors.email && (
              <span className="errorText">{formErrors.email}</span>
            )}
          </div>

          <div className="formGroup">
            <label htmlFor="password">
              Password <span className="required">*</span>
            </label>
            <input
              type="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`rInput ${
                touchedFields.password && formErrors.password
                  ? "inputError"
                  : ""
              }`}
              placeholder="Enter password"
            />
            {touchedFields.password && formErrors.password && (
              <span className="errorText">{formErrors.password}</span>
            )}
          </div>

          <div className="formGroup">
            <label htmlFor="confirmPassword">
              Confirm Password <span className="required">*</span>
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`rInput ${
                touchedFields.confirmPassword && formErrors.confirmPassword
                  ? "inputError"
                  : ""
              }`}
              placeholder="Confirm your password"
            />
            {touchedFields.confirmPassword && formErrors.confirmPassword && (
              <span className="errorText">{formErrors.confirmPassword}</span>
            )}
          </div>

          <div className="formGroup">
            <label htmlFor="phone">
              Phone Number <span className="required">*</span>
            </label>
            <input
              type="tel"
              id="phone"
              value={formData.phone}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`rInput ${
                touchedFields.phone && formErrors.phone ? "inputError" : ""
              }`}
              placeholder="Enter phone number"
            />
            {touchedFields.phone && formErrors.phone && (
              <span className="errorText">{formErrors.phone}</span>
            )}
          </div>

          <div className="formRow">
            <div className="formGroup half">
              <label htmlFor="city">City</label>
              <input
                type="text"
                id="city"
                value={formData.city}
                onChange={handleChange}
                className="rInput"
                placeholder="Your city"
              />
            </div>

            <div className="formGroup half">
              <label htmlFor="country">Country</label>
              <input
                type="text"
                id="country"
                value={formData.country}
                onChange={handleChange}
                className="rInput disabled"
                placeholder="Bangladesh"
                disabled
              />
            </div>
          </div>

          <button type="submit" className="rButton" disabled={loading}>
            {loading ? "Creating Account..." : "Register"}
          </button>

          {error && <div className="errorMessage">{error}</div>}
          {successMessage && (
            <div className="successMessage">{successMessage}</div>
          )}

          <div className="loginLink">
            Already have an account? <Link to="/login">Login</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
