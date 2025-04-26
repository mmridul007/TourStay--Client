import { useState, useEffect, useContext } from "react";
import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/Footer";
import { useParams, useNavigate } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import "./profile.css";
import axios from "axios";
import RoomPost from "../roomPost/RoomPost";
import { AuthContext } from "../../components/context/AuthContext";


const Profile = () => {
  const { id } = useParams();
  const { data: user } = useFetch(`/users/${id}`);
  const { user: currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editedUser, setEditedUser] = useState({});
  const [tempImgSrc, setTempImgSrc] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Check if user is authenticated
  useEffect(() => {
    if (!currentUser) {
      navigate("/login"); // Redirect to login page if not authenticated
    }
  }, [currentUser, navigate]);

  // Initialize edited user data when user data changes
  useEffect(() => {
    if (user && Object.keys(user).length > 0) {
      setEditedUser({ ...user });
      setTempImgSrc(user.img);
    }
  }, [user]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setError(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedUser({ ...editedUser, [name]: value });
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);

      // Create a preview
      const reader = new FileReader();
      reader.onload = (event) => {
        setTempImgSrc(event.target.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const uploadImageToCloudinary = async () => {
    if (!file) {
      setError("No file selected.");
      return null;
    }
    const UPLOAD_PRESET = "upload"; // Replace with your actual upload preset

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/dkkdfz2n0/image/upload`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      console.log("Cloudinary Upload Response:", response.data);
      return response.data.secure_url;
    } catch (err) {
      setError("Failed to upload image. Please try again.");
      console.error("Error uploading to Cloudinary:", err);
      return null;
    }
  };

  const updateUserInfo = async (userData) => {
    try {
      const response = await axios.put(`/users/${id}`, userData);
      return response.data;
    } catch (err) {
      setError("Failed to update user information. Please try again.");
      console.error("Error updating user:", err);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // First upload the image if there's a new one
      let imageUrl = editedUser.img;
      if (file) {
        const uploadedUrl = await uploadImageToCloudinary();
        if (uploadedUrl) {
          imageUrl = uploadedUrl;
        } else {
          // If image upload failed but we have an error set already, return early
          if (error) {
            setLoading(false);
            return;
          }
        }
      }

      // Prepare the updated user data
      const updatedUserData = {
        ...editedUser,
        img: imageUrl,
      };

      // Update the user info in your API
      const result = await updateUserInfo(updatedUserData);

      if (result) {
        // Success! Close the modal
        closeModal();
        // You might want to refresh the user data
        // If your useFetch hook doesn't auto-refresh, you might need another approach
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      console.error("Error in form submission:", err);
    }

    setLoading(false);
  };

  // If not authenticated, don't render the component (already redirecting)
  if (!currentUser) {
    return null;
  }

  return (
    <div>
      <Navbar />
      <div className="profileContainer">
        <h1>User Information</h1>
        <div className="userInfoContainer">
          <span className="userImg">
            <img src={user?.img} alt="user_photo" />
          </span>

          <div className="userInfo">
            <h2>Username: {user?.username}</h2>
            <span>
              <span className="title">E-mail:</span> {user?.email}
            </span>{" "}
            <br />
            <span>
              <span className="title">Phone:</span> {user?.phone}
            </span>{" "}
            <br />
            <span>
              <span className="title">Lives in:</span> {user?.city}
            </span>
          </div>
        </div>

        {/* Only show edit button if the profile belongs to the current user */}
        {currentUser && currentUser._id === id && (
          <button className="editButton1" onClick={openModal}>
            Edit
          </button>
        )}
      </div>

      {/* Edit Modal */}
      {isModalOpen && editedUser && (
        <div className="modalOverlay">
          <div className="modalContent">
            <h2>Edit Profile</h2>
            {error && <div className="errorMessage">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="photoUploadSection">
                <div className="photoPreview1">
                  <img src={tempImgSrc} alt="Profile preview" />
                  <label htmlFor="photo-upload" className="uploadButton1">
                    Upload
                  </label>
                </div>
                <input
                  id="photo-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                <p className="photoUploadText">Click to upload a new photo</p>
              </div>

              <div className="formGroup">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={editedUser.email || ""}
                  onChange={handleChange}
                />
              </div>

              <div className="formGroup">
                <label>Phone</label>
                <input
                  type="text"
                  name="phone"
                  value={editedUser.phone || ""}
                  onChange={handleChange}
                />
              </div>

              <div className="formGroup">
                <label>City</label>
                <input
                  type="text"
                  name="city"
                  value={editedUser.city || ""}
                  onChange={handleChange}
                />
              </div>

              <div className="modalButtons">
                <button
                  type="button"
                  className="cancelButton"
                  onClick={closeModal}
                  disabled={loading}
                >
                  Cancel
                </button>
                <button type="submit" className="saveButton" disabled={loading}>
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <RoomPost id={id} />

      <Footer />
    </div>
  );
};

export default Profile;
