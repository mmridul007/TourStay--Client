import {
  faBed,
  faPhone,
  faBars,
  faTimes,
  faPersonShelter,
  faClipboardList,
  faSignInAlt,
  faUserPlus,
  faSignOutAlt
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext, useState, useEffect } from "react";
import "./navbar.css";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeItem, setActiveItem] = useState("hotels"); // Default active item
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { user } = useContext(AuthContext);

  const handleProfile = () => {
    navigate(`/profile/${user._id}`);
  }

  const handleOrders = () => {
    navigate(`/orders/${user._id}`);
  }
  
  // Set active item based on current location/path
  useEffect(() => {
    if (location.pathname.startsWith("/profile")) {
      // Don't set any item as active on profile pages
      setActiveItem("");
    } else if (location.pathname.startsWith("/hotels") || location.pathname === "/") {
      setActiveItem("hotels");
    } else if (location.pathname.startsWith("/quickrooms")) {
      setActiveItem("quickrooms");
    } else if (location.pathname.startsWith("/contact")) {
      setActiveItem("contact");
    } else if (location.pathname.startsWith("/orders")) {
      setActiveItem("orders");
    } else {
      setActiveItem("");
    }
  }, [location.pathname]);
  
  const handleItemClick = (item) => {
    setActiveItem(item);
    // Navigate to the corresponding page
    navigate(`/${item === "hotels" ? "" : item}`);

    // Close sidebar if open
    if (sidebarOpen) {
      setSidebarOpen(false);
    }
  };

  const handleLogout = () => {
    // Clear user state or token here
    console.log("User logged out");
    // Example if using localStorage:
    localStorage.removeItem("user");
    window.location.reload(); // Refresh to update UI
  };

  const handleLogin = () => {
    navigate("/login");
    if (sidebarOpen) {
      setSidebarOpen(false);
    }
  };

  const handleRegister = () => {
    navigate("/register");
    if (sidebarOpen) {
      setSidebarOpen(false);
    }
  };

  // Handle click outside to close sidebar
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        sidebarOpen &&
        !e.target.closest(".sidebar") &&
        !e.target.closest(".menu-icon")
      ) {
        setSidebarOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [sidebarOpen]);

  // Lock body scroll when sidebar is open
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [sidebarOpen]);

  return (
    <>
      <div className="navbar">
        <div className="navContainer">
          <Link
            to="/"
            className="navLogo"
            onClick={() => setActiveItem("hotels")}
          >
            <img
              src="https://res.cloudinary.com/dkkdfz2n0/image/upload/v1739601631/Screenshot_2025-02-15_at_12.35.55_PM_opxr4x.png"
              className="logo"
              alt="Logo"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="headerList">
            <div
              className={`headerListItem ${
                activeItem === "hotels" ? "active" : ""
              }`}
              onClick={() => handleItemClick("hotels")}
            >
              <FontAwesomeIcon icon={faBed} />
              <span>Hotels</span>
            </div>
            <div
              className={`headerListItem ${
                activeItem === "quickrooms" ? "active" : ""
              }`}
              onClick={() => handleItemClick("quickrooms")}
            >
              <FontAwesomeIcon icon={faPersonShelter} />
              <span>Quick Stay</span>
            </div>
            <div
              className={`headerListItem ${
                activeItem === "contact" ? "active" : ""
              }`}
              onClick={() => handleItemClick("contact")}
            >
              <FontAwesomeIcon icon={faPhone} />
              <span>Contact Us</span>
            </div>
          </div>

          {/* Desktop user actions */}
          {user ? (
            <div className="navItems">
              {user.img ? (
                <img onClick={handleProfile} src={user.img} alt={user.username} className="userImage" />
              ) : (
                <span onClick={handleProfile} className="usernameText">{user.username}</span>
              )}
              <div 
                className="orderButton" 
                onClick={handleOrders}
              >
                <FontAwesomeIcon icon={faClipboardList} />
                <span>Orders</span>
              </div>
              <button className="navButton logoutButton" onClick={handleLogout}>
                <FontAwesomeIcon icon={faSignOutAlt} className="buttonIcon" />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div className="navItems authButtonContainer">
              <button onClick={handleRegister} className="navButton registerButton">
                <FontAwesomeIcon icon={faUserPlus} className="buttonIcon" />
                <span>Register</span>
              </button>
              <button onClick={handleLogin} className="navButton loginButton">
                <FontAwesomeIcon icon={faSignInAlt} className="buttonIcon" />
                <span>Login</span>
              </button>
            </div>
          )}

          {/* Mobile Menu Icon */}
          <div className="menu-icon" onClick={() => setSidebarOpen(true)}>
            <FontAwesomeIcon icon={faBars} />
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="close-icon" onClick={() => setSidebarOpen(false)}>
          <FontAwesomeIcon icon={faTimes} />
        </div>
        <div className="mobile-menu">
          <div
            className={`mobile-menu-item ${
              activeItem === "hotels" ? "active" : ""
            }`}
            onClick={() => handleItemClick("hotels")}
          >
            <FontAwesomeIcon icon={faBed} />
            <span>Hotels</span>
          </div>
          <div
            className={`mobile-menu-item ${
              activeItem === "quickrooms" ? "active" : ""
            }`}
            onClick={() => handleItemClick("quickrooms")}
          >
            <FontAwesomeIcon icon={faPersonShelter} />
            <span>Quick Stay</span>
          </div>
          <div
            className={`mobile-menu-item ${
              activeItem === "contact" ? "active" : ""
            }`}
            onClick={() => handleItemClick("contact")}
          >
            <FontAwesomeIcon icon={faPhone} />
            <span>Contact Us</span>
          </div>
          {user && (
            <div
              className={`mobile-menu-item ${
                activeItem === "orders" ? "active" : ""
              }`}
              onClick={() => handleItemClick("orders")}
            >
              <FontAwesomeIcon icon={faClipboardList} />
              <span onClick={handleOrders}>Orders</span>
            </div>
          )}
        </div>

        {/* Mobile user actions */}
        {user ? (
          <div className="mobile-nav-buttons">
            {user.img ? (
              <img 
                src={user.img} 
                alt={user.username} 
                className="userImage"
                onClick={handleProfile} 
              />
            ) : (
              <span className="username" onClick={handleProfile}>{user.username}</span>
            )}
            <button className="navButton logoutButton" onClick={handleLogout}>
              <FontAwesomeIcon icon={faSignOutAlt} className="buttonIcon" />
              <span>Logout</span>
            </button>
          </div>
        ) : (
          <div className="mobile-nav-buttons">
            <button onClick={handleRegister} className="navButton registerButton">
              <FontAwesomeIcon icon={faUserPlus} className="buttonIcon" />
              <span>Register</span>
            </button>
            <button onClick={handleLogin} className="navButton loginButton">
              <FontAwesomeIcon icon={faSignInAlt} className="buttonIcon" />
              <span>Login</span>
            </button>
          </div>
        )}
      </div>

      {/* Overlay when sidebar is open */}
      <div
        className={`overlay ${sidebarOpen ? "show" : ""}`}
        onClick={() => setSidebarOpen(false)}
      ></div>
    </>
  );
};

export default Navbar;