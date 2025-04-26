import React, { useState, useEffect } from "react";
import "./manageRoom.css";
import useFetch from "../../../hooks/useFetch";
import axios from "axios";

// Constants
const MAX_ROOMS = 3;
const MAX_PHOTOS = 5;

const PEOPLE_ALLOWED_OPTIONS = [
  "Anyone",
  "Family Only",
  "Bachelors Only",
  "Female Only",
  "Male Only",
];

const PEOPLE_NOT_ALLOWED_OPTIONS = [
  "Children",
  "Pets",
  "Smokers",
  "Guests After Hours",
];

const REQUIRED_DOCUMENTS_OPTIONS = [
  "National ID",
  "Passport",
  "Driving License",
  "Work ID",
  "Student ID",
];

const initialFormData = {
  title: "",
  roomType: "AC",
  cheapestPrice: "",
  desc: "",
  city: "",
  address: "",
  mapLocation: "",
  photos: [],
  isSmokingAllowed: false,
  messageOfSmoking: "",
  isPetAllowed: false,
  messageOfPet: "",
  isWifiAvailable: false,
  isParkingAvailable: false,
  isAvailableForRent: true,
  diningRoom: false,
  kitchen: false,
  refrigerator: false,
  oven: false,
  whichPeopleAreAllowed: "Anyone",
  whichTypeOfPeopleAreNotAllowed: [],
  totalGusts: 1,
  totalRooms: 1,
  totalBedrooms: 1,
  totalBeds: 1,
  totalBathrooms: 1,
  bathRoomType: "Attached",
  requiredDocuments: [],
  electricityTime: "24 hours",
  waterTime: "24 hours",
  isGasAvailable: true,
  maxPeople: 2,
};

const ManageRooms = ({ userId }) => {
  // State
  const {
    data: rooms,
    loading,
    error,
    reFetch,
  } = useFetch(`/quickrooms/userID/${userId}`);
  const [userRooms, setUserRooms] = useState([]);
  const [modalState, setModalState] = useState({
    add: false,
    edit: false,
    view: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentRoom, setCurrentRoom] = useState(null);
  const [uploadedPhotos, setUploadedPhotos] = useState([]);
  const [photoLoading, setPhotoLoading] = useState(false);
  const [photoError, setPhotoError] = useState("");
  const [formData, setFormData] = useState(initialFormData);
  const [formErrors, setFormErrors] = useState({});

  // Derived values
  const canAddRoom = userRooms.length < MAX_ROOMS;

  // Effects
  useEffect(() => {
    if (rooms) {
      setUserRooms(
        [...rooms].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
      );
    }
  }, [rooms]);

  useEffect(() => {
    if (currentRoom) {
      setFormData({
        ...initialFormData,
        ...currentRoom,
        requiredDocuments: currentRoom.requiredDocuments || [],
        whichTypeOfPeopleAreNotAllowed:
          currentRoom.whichTypeOfPeopleAreNotAllowed || [],
      });
    }
  }, [currentRoom]);

  // Helper functions
  const toggleModal = (modalName, isOpen) => {
    setModalState((prev) => ({ ...prev, [modalName]: isOpen }));
  };

  const handleViewRoom = (room) => {
    setCurrentRoom(room);
    toggleModal("view", true);
  };

  const handleAddRoom = () => {
    setFormData(initialFormData);
    setUploadedPhotos([]);
    setFormErrors({});
    setPhotoError("");
    toggleModal("add", true);
  };

  const handleEditRoom = (room) => {
    setCurrentRoom(room);
    setUploadedPhotos(room.photos || []);
    setFormErrors({});
    setPhotoError("");
    toggleModal("edit", true);
  };

  const handleDeleteRoom = async (roomId, photos) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this room? This will also delete all associated photos."
      )
    ) {
      return;
    }

    try {
      setIsSubmitting(true);
      await axios.delete(`http://localhost:4000/api/quickrooms/${roomId}`);

      if (photos?.length > 0) {
        const deletePromises = photos.map((photo) => {
          const urlParts = photo.split("/");
          const filenameWithExt = urlParts[urlParts.length - 1];
          const public_id = filenameWithExt.split(".")[0];
          return axios.post("http://localhost:4000/cloudinary/delete", {
            public_id,
          });
        });
        await Promise.all(deletePromises);
      }

      setUserRooms((prev) => prev.filter((room) => room._id !== roomId));
    } catch (err) {
      alert("Failed to delete room. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else if (
      name === "whichTypeOfPeopleAreNotAllowed" ||
      name === "requiredDocuments"
    ) {
      const optionValue = e.target.value;
      const isChecked = e.target.checked;

      setFormData((prev) => {
        const currentArray = prev[name] || [];
        return {
          ...prev,
          [name]: isChecked
            ? [...currentArray, optionValue]
            : currentArray.filter((item) => item !== optionValue),
        };
      });
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handlePhotoUpload = async (e) => {
    const files = e.target.files;
    setPhotoError("");

    if (uploadedPhotos.length + files.length > MAX_PHOTOS) {
      setPhotoError(
        `You can upload a maximum of ${MAX_PHOTOS} photos. You've already uploaded ${uploadedPhotos.length}.`
      );
      return;
    }

    for (let i = 0; i < files.length; i++) {
      if (!files[i].type.match("image.*")) {
        setPhotoError("Please upload only image files.");
        return;
      }
    }

    setPhotoLoading(true);
    try {
      const newPhotoUrls = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formDataForFile = new FormData();
        formDataForFile.append("file", file);
        formDataForFile.append("upload_preset", "upload");

        const response = await fetch(
          "https://api.cloudinary.com/v1_1/dkkdfz2n0/image/upload",
          { method: "POST", body: formDataForFile }
        );

        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        newPhotoUrls.push(data.secure_url);
      }

      setUploadedPhotos((prev) => [...prev, ...newPhotoUrls]);
      setFormData((prev) => ({
        ...prev,
        photos: [...prev.photos, ...newPhotoUrls],
      }));
    } catch (err) {
      console.error("Error uploading photos:", err);
      setPhotoError("Failed to upload photos. Please try again.");
    } finally {
      setPhotoLoading(false);
    }
  };

  const handleRemovePhoto = async (index, isCloudinaryUrl) => {
    if (
      isCloudinaryUrl &&
      !window.confirm("Are you sure you want to remove this photo?")
    ) {
      return;
    }

    try {
      if (isCloudinaryUrl) {
        const photoUrl = uploadedPhotos[index];
        const urlParts = photoUrl.split("/");
        const filenameWithExt = urlParts[urlParts.length - 1];
        const public_id = filenameWithExt.split(".")[0];
        await axios.post("http://localhost:4000/cloudinary/delete", {
          public_id,
        });
      }

      const newPhotos = [...uploadedPhotos];
      newPhotos.splice(index, 1);
      setUploadedPhotos(newPhotos);
      setFormData((prev) => ({ ...prev, photos: newPhotos }));
    } catch (err) {
      console.error("Error removing photo:", err);
      alert("Failed to remove photo. Please try again.");
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.title) errors.title = "Room title is required";
    if (!formData.cheapestPrice) errors.cheapestPrice = "Price is required";
    if (!formData.city) errors.city = "City is required";
    if (!formData.address) errors.address = "Address is required";
    if (!formData.desc) errors.desc = "Description is required";
    if (!formData.mapLocation) errors.mapLocation = "Map location is required";
    if (uploadedPhotos.length === 0)
      errors.photos = "At least one photo is required";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      if (modalState.add) {
        await axios.post(`http://localhost:4000/api/quickrooms/`, {
          ...formData,
          userID: userId,
          photos: uploadedPhotos,
        });
        toggleModal("add", false);
        reFetch();
      } else if (modalState.edit && currentRoom) {
        const oldPhotos = currentRoom.photos || [];
        const photosToDelete = oldPhotos.filter(
          (photo) => !uploadedPhotos.includes(photo)
        );

        if (photosToDelete.length > 0) {
          const deletePromises = photosToDelete.map((photo) => {
            const urlParts = photo.split("/");
            const filenameWithExt = urlParts[urlParts.length - 1];
            const public_id = filenameWithExt.split(".")[0];
            return axios.post("http://localhost:4000/cloudinary/delete", {
              public_id,
            });
          });
          await Promise.all(deletePromises);
        }

        await axios.put(
          `http://localhost:4000/api/quickrooms/${currentRoom._id}`,
          {
            ...formData,
            photos: uploadedPhotos,
          }
        );
        toggleModal("edit", false);
        reFetch();
      }
    } catch (err) {
      console.error("Error saving room:", err);
      alert("Failed to save room. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render functions
  const renderRoomCards = () => (
    <div className="roomsList">
      {userRooms.map((room) => (
        <div className="roomCard" key={room._id}>
          <div className="roomImageContainer">
            <img
              src={room.photos?.[0] || "/placeholder-room.jpg"}
              alt={room.title}
              className="roomImage"
            />
          </div>
          <div className="roomDetails">
            <h4>{room.title}</h4>
            <p className="roomLocation">
              {room.city}, {room.address}
            </p>
            <p className="roomPrice">{room.cheapestPrice} BDT/night</p>
            <div className="roomAvailabilityStatus">
              <span
                className={`availabilityBadge ${
                  room.isAvailableForRent ? "available" : "unavailable"
                }`}
              >
                {room.isAvailableForRent ? "Available" : "Unvailable"}
              </span>
            </div>
            <div className="roomActions">
              <button
                className="viewButton"
                onClick={() => handleViewRoom(room)}
              >
                View Room
              </button>
              <button
                className="editButton"
                onClick={() => handleEditRoom(room)}
              >
                Edit
              </button>
              <button
                className="deleteButton"
                onClick={() => handleDeleteRoom(room._id, room.photos)}
                disabled={isSubmitting}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
      <div className="roomSlotsInfo">
        {userRooms.length > 0 && (
          <p>
            You have used {userRooms.length} of {MAX_ROOMS} room slots.
          </p>
        )}
      </div>
    </div>
  );

  const renderNoRoomsMessage = () => (
    <div className="noRoomsMessage">
      <p>You haven't posted any rooms yet.</p>
      <button className="addRoomButton" onClick={handleAddRoom}>
        Add Room
      </button>
    </div>
  );

  const renderBasicInfoSection = () => (
    <div className="formSection">
      <h3>Basic Information</h3>
      <div className="formGroup">
        <label htmlFor="title">Room Title:</label>
        <input
          type="text"
          name="title"
          id="title"
          placeholder="Enter room title"
          value={formData.title}
          onChange={handleChange}
        />
        {formErrors.title && (
          <span className="errorText">{formErrors.title}</span>
        )}
      </div>

      <div className="formGroup">
        <label htmlFor="roomType">Room Type:</label>
        <select
          name="roomType"
          id="roomType"
          value={formData.roomType}
          onChange={handleChange}
        >
          <option value="AC">AC</option>
          <option value="Non-AC">Non-AC</option>
        </select>
      </div>

      <div className="formRow">
        <div className="formGroup">
          <label htmlFor="city">City:</label>
          <input
            type="text"
            name="city"
            id="city"
            placeholder="City"
            value={formData.city}
            onChange={handleChange}
          />
          {formErrors.city && (
            <span className="errorText">{formErrors.city}</span>
          )}
        </div>

        <div className="formGroup">
          <label htmlFor="address">Address:</label>
          <input
            type="text"
            name="address"
            id="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
          />
          {formErrors.address && (
            <span className="errorText">{formErrors.address}</span>
          )}
        </div>
      </div>

      <div className="formGroup">
        <label htmlFor="mapLocation">Map Location:</label>
        <input
          type="text"
          name="mapLocation"
          id="mapLocation"
          placeholder="Map Location"
          value={formData.mapLocation}
          onChange={handleChange}
        />
      </div>

      <div className="formGroup">
        <label htmlFor="cheapestPrice">Price (BDT/night):</label>
        <input
          type="number"
          name="cheapestPrice"
          id="cheapestPrice"
          placeholder="Price"
          value={formData.cheapestPrice}
          onChange={handleChange}
        />
        {formErrors.cheapestPrice && (
          <span className="errorText">{formErrors.cheapestPrice}</span>
        )}
      </div>

      <div className="formGroup">
        <label htmlFor="desc">Description:</label>
        <textarea
          name="desc"
          id="desc"
          placeholder="Description of your room"
          rows="4"
          value={formData.desc}
          onChange={handleChange}
        ></textarea>
        {formErrors.desc && (
          <span className="errorText">{formErrors.desc}</span>
        )}
      </div>
    </div>
  );

  const renderRoomSpecsSection = () => (
    <div className="formSection">
      <h3>Room Specifications</h3>
      <div className="formRow">
        <div className="formGroup">
          <label htmlFor="totalGusts">Maximum Guests:</label>
          <input
            type="number"
            name="totalGusts"
            id="totalGusts"
            min="1"
            value={formData.totalGusts}
            onChange={handleChange}
          />
        </div>
      </div>
      <div className="formRow">
        <div className="formGroup">
          <label htmlFor="totalRooms">Total Rooms:</label>
          <input
            type="number"
            name="totalRooms"
            id="totalRooms"
            min="1"
            value={formData.totalRooms}
            onChange={handleChange}
          />
        </div>
        <div className="formGroup">
          <label htmlFor="totalBedrooms">Total Bedrooms:</label>
          <input
            type="number"
            name="totalBedrooms"
            id="totalBedrooms"
            min="0"
            value={formData.totalBedrooms}
            onChange={handleChange}
          />
        </div>
      </div>
      <div className="formRow">
        <div className="formGroup">
          <label htmlFor="totalBeds">Total Beds:</label>
          <input
            type="number"
            name="totalBeds"
            id="totalBeds"
            min="1"
            value={formData.totalBeds}
            onChange={handleChange}
          />
        </div>
        <div className="formGroup">
          <label htmlFor="totalBathrooms">Total Bathrooms:</label>
          <input
            type="number"
            name="totalBathrooms"
            id="totalBathrooms"
            min="1"
            value={formData.totalBathrooms}
            onChange={handleChange}
          />
        </div>
      </div>
      <div className="formGroup">
        <label htmlFor="bathRoomType">Bathroom Type:</label>
        <select
          name="bathRoomType"
          id="bathRoomType"
          value={formData.bathRoomType}
          onChange={handleChange}
        >
          <option value="Attached">Attached</option>
          <option value="Shared">Shared</option>
          <option value="Private">Private</option>
        </select>
      </div>
    </div>
  );

  const renderAmenitiesSection = () => (
    <div className="formSection">
      <h3>Amenities</h3>
      <div className="formRow checkboxGroup">
        <div className="formGroup">
          <input
            type="checkbox"
            name="isWifiAvailable"
            id="isWifiAvailable"
            checked={formData.isWifiAvailable}
            onChange={handleChange}
          />
          <label htmlFor="isWifiAvailable">WiFi Available</label>
        </div>
        <div className="formGroup">
          <input
            type="checkbox"
            name="isParkingAvailable"
            id="isParkingAvailable"
            checked={formData.isParkingAvailable}
            onChange={handleChange}
          />
          <label htmlFor="isParkingAvailable">Parking Available</label>
        </div>
      </div>
      <div className="formRow checkboxGroup">
        <div className="formGroup">
          <input
            type="checkbox"
            name="diningRoom"
            id="diningRoom"
            checked={formData.diningRoom}
            onChange={handleChange}
          />
          <label htmlFor="diningRoom">Dining Room</label>
        </div>
        <div className="formGroup">
          <input
            type="checkbox"
            name="kitchen"
            id="kitchen"
            checked={formData.kitchen}
            onChange={handleChange}
          />
          <label htmlFor="kitchen">Kitchen</label>
        </div>
      </div>
      <div className="formRow checkboxGroup">
        <div className="formGroup">
          <input
            type="checkbox"
            name="refrigerator"
            id="refrigerator"
            checked={formData.refrigerator}
            onChange={handleChange}
          />
          <label htmlFor="refrigerator">Refrigerator</label>
        </div>
        <div className="formGroup">
          <input
            type="checkbox"
            name="oven"
            id="oven"
            checked={formData.oven}
            onChange={handleChange}
          />
          <label htmlFor="oven">Oven</label>
        </div>
      </div>
    </div>
  );

  const renderUtilitiesSection = () => (
    <div className="formSection">
      <h3>Utilities</h3>
      <div className="formGroup">
        <label htmlFor="electricityTime">Electricity Availability:</label>
        <select
          name="electricityTime"
          id="electricityTime"
          value={formData.electricityTime}
          onChange={handleChange}
        >
          <option value="24 hours">24 hours</option>
          <option value="18-20 hours">18-20 hours</option>
          <option value="12-18 hours">12-18 hours</option>
          <option value="<12 hours">Less than 12 hours</option>
        </select>
      </div>
      <div className="formGroup">
        <label htmlFor="waterTime">Water Availability:</label>
        <select
          name="waterTime"
          id="waterTime"
          value={formData.waterTime}
          onChange={handleChange}
        >
          <option value="24 hours">24 hours</option>
          <option value="12-24 hours">12-24 hours</option>
          <option value="6-12 hours">6-12 hours</option>
          <option value="<6 hours">Less than 6 hours</option>
        </select>
      </div>
      <div className="formGroup">
        <input
          type="checkbox"
          name="isGasAvailable"
          id="isGasAvailable"
          checked={formData.isGasAvailable}
          onChange={handleChange}
        />
        <label htmlFor="isGasAvailable">Gas Available</label>
      </div>
    </div>
  );

  const renderRulesSection = () => (
    <div className="formSection">
      <h3>Rules & Restrictions</h3>
      <div className="formGroup">
        <input
          type="checkbox"
          name="isAvailableForRent"
          id="isAvailableForRent"
          checked={formData.isAvailableForRent}
          onChange={handleChange}
        />
        <label htmlFor="isAvailableForRent">Available for Rent</label>
      </div>
      <div className="formGroup">
        <div className="checkboxWithDetails">
          <div>
            <input
              type="checkbox"
              name="isSmokingAllowed"
              id="isSmokingAllowed"
              checked={formData.isSmokingAllowed}
              onChange={handleChange}
            />
            <label htmlFor="isSmokingAllowed">Smoking Allowed</label>
          </div>
          {formData.isSmokingAllowed && (
            <input
              type="text"
              name="messageOfSmoking"
              placeholder="Any specific instructions about smoking"
              value={formData.messageOfSmoking}
              onChange={handleChange}
            />
          )}
        </div>
      </div>
      <div className="formGroup">
        <div className="checkboxWithDetails">
          <div>
            <input
              type="checkbox"
              name="isPetAllowed"
              id="isPetAllowed"
              checked={formData.isPetAllowed}
              onChange={handleChange}
            />
            <label htmlFor="isPetAllowed">Pets Allowed</label>
          </div>
          {formData.isPetAllowed && (
            <input
              type="text"
              name="messageOfPet"
              placeholder="Any specific instructions about pets"
              value={formData.messageOfPet}
              onChange={handleChange}
            />
          )}
        </div>
      </div>
      <div className="formGroup">
        <label htmlFor="whichPeopleAreAllowed">Allowed Guests:</label>
        <select
          name="whichPeopleAreAllowed"
          id="whichPeopleAreAllowed"
          value={formData.whichPeopleAreAllowed}
          onChange={handleChange}
        >
          <option value="Anyone">Anyone</option>
          <option value="Families">Families Only</option>
          <option value="Males">Males Only</option>
          <option value="Females">Females Only</option>
          <option value="Couples">Couples Only</option>
          <option value="Students">Students Only</option>
        </select>
      </div>
      <div className="formGroup">
        <label>Not Allowed (select multiple):</label>
        {["Children", "Pets", "Unmarried Couples", "Bachelors", "Students"].map(
          (group) => (
            <div key={group}>
              <input
                type="checkbox"
                id={group}
                value={group}
                checked={formData.whichTypeOfPeopleAreNotAllowed.includes(
                  group
                )}
                onChange={(e) => {
                  const { checked, value } = e.target;
                  const updated = checked
                    ? [...formData.whichTypeOfPeopleAreNotAllowed, value]
                    : formData.whichTypeOfPeopleAreNotAllowed.filter(
                        (item) => item !== value
                      );
                  setFormData({
                    ...formData,
                    whichTypeOfPeopleAreNotAllowed: updated,
                  });
                }}
              />
              <label htmlFor={group}>{group}</label>
            </div>
          )
        )}
      </div>
      <div className="formGroup">
        <label>Required Documents (select multiple):</label>
        {[
          "ID Card",
          "Passport",
          "Driving License",
          "Bank Statement",
          "Employment Letter",
          "Student ID",
        ].map((doc) => (
          <div key={doc}>
            <input
              type="checkbox"
              id={doc}
              value={doc}
              checked={formData.requiredDocuments.includes(doc)}
              onChange={(e) => {
                const { checked, value } = e.target;
                const updated = checked
                  ? [...formData.requiredDocuments, value]
                  : formData.requiredDocuments.filter((item) => item !== value);
                setFormData({
                  ...formData,
                  requiredDocuments: updated,
                });
              }}
            />
            <label htmlFor={doc}>{doc}</label>
          </div>
        ))}
      </div>
    </div>
  );

  const renderPhotosSection = () => (
    <div className="formSection">
      <h3>Room Photos</h3>
      <div className="photoUploadContainer">
        <div className="photoUploadBox">
          <input
            type="file"
            id="roomPhotos"
            multiple
            accept="image/*"
            onChange={handlePhotoUpload}
            disabled={photoLoading || uploadedPhotos.length >= MAX_PHOTOS}
          />
          <label htmlFor="roomPhotos" className="uploadPhotoBtn">
            {photoLoading
              ? "Uploading..."
              : `Select Photos (${uploadedPhotos.length}/${MAX_PHOTOS})`}
          </label>
        </div>
        {photoError && <span className="errorText">{photoError}</span>}
        {formErrors.photos && (
          <span className="errorText">{formErrors.photos}</span>
        )}

        {uploadedPhotos.length > 0 && (
          <div className="photoPreviewContainer">
            {uploadedPhotos.map((photo, index) => (
              <div className="photoPreview" key={index}>
                <img src={photo} alt={`Room preview ${index + 1}`} />
                <button
                  type="button"
                  className="removePhotoBtn"
                  onClick={() => handleRemovePhoto(index, true)}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderModalActions = () => (
    <div className="modalActions">
      <button
        type="button"
        className="cancelButton"
        onClick={() => toggleModal(modalState.add ? "add" : "edit", false)}
        disabled={isSubmitting || photoLoading}
      >
        Cancel
      </button>
      <button
        type="submit"
        className="submitButton"
        disabled={isSubmitting || photoLoading}
      >
        {isSubmitting
          ? modalState.add
            ? "Adding..."
            : "Saving..."
          : modalState.add
          ? "Add Room"
          : "Save Changes"}
      </button>
    </div>
  );

  const renderAddEditModal = () => (
    <div className="modalOverlay">
      <div className="modalContent">
        <h2>{modalState.add ? "Add New Room" : "Edit Room"}</h2>
        <form onSubmit={handleSubmit}>
          {renderBasicInfoSection()}
          {renderRoomSpecsSection()}
          {renderAmenitiesSection()}
          {renderUtilitiesSection()}
          {renderRulesSection()}
          {renderPhotosSection()}
          {renderModalActions()}
        </form>
      </div>
    </div>
  );

  const renderViewModal = () => (
    <div className="modalOverlay">
      <div className="modalContent">
        <h2>{currentRoom.title}</h2>
        <p>
          <strong>Price:</strong> {currentRoom.cheapestPrice} BDT/night
        </p>
        <p>
          <strong>City:</strong> {currentRoom.city}
        </p>
        <p>
          <strong>Address:</strong> {currentRoom.address}
        </p>
        <p>
          <strong>Description:</strong> {currentRoom.desc}
        </p>
        <p>
          <strong>Smoking Allowed:</strong>{" "}
          {currentRoom.isSmokingAllowed ? "Yes" : "No"}
        </p>
        <p>
          <strong>Pets Allowed:</strong>{" "}
          {currentRoom.isPetAllowed ? "Yes" : "No"}
        </p>
        <p>
          <strong>WiFi Available:</strong>{" "}
          {currentRoom.isWifiAvailable ? "Yes" : "No"}
        </p>
        <p>
          <strong>Parking Available:</strong>{" "}
          {currentRoom.isParkingAvailable ? "Yes" : "No"}
        </p>
        <p>
          <strong>Total Guests:</strong> {currentRoom.totalGuests}
        </p>
        <p>
          <strong>Total Rooms:</strong> {currentRoom.totalRooms}
        </p>
        <p>
          <strong>Total Bedrooms:</strong> {currentRoom.totalBedrooms}
        </p>
        <p>
          <strong>Total Beds:</strong> {currentRoom.totalBeds}
        </p>
        <p>
          <strong>Total Bathrooms:</strong> {currentRoom.totalBathrooms}
        </p>
        <p>
          <strong>Bathroom Type:</strong> {currentRoom.bathRoomType}
        </p>
        <p>
          <strong>Available:</strong>{" "}
          {currentRoom.isAvailableForRent ? "Yes" : "No"}
        </p>
        <button
          className="cancelButton"
          onClick={() => toggleModal("view", false)}
        >
          Close
        </button>
      </div>
    </div>
  );

  if (loading) return <div className="loading">Loading your rooms...</div>;
  if (error) return <div className="error">Error loading rooms: {error}</div>;

  return (
    <div className="manageRooms">
      <div className="manageRoomsHeader">
        <h3>Your Room Listings</h3>
        {canAddRoom && (
          <button className="addRoomButton" onClick={handleAddRoom}>
            Add Room
          </button>
        )}
      </div>

      {userRooms.length === 0 ? renderNoRoomsMessage() : renderRoomCards()}
      {modalState.add && renderAddEditModal()}
      {modalState.edit && renderAddEditModal()}
      {modalState.view && renderViewModal()}
    </div>
  );
};

export default ManageRooms;
