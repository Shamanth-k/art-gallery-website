import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/ProfilePage.css"; // Assuming you have a CSS file for styling

const ProfilePage = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [activeSection, setActiveSection] = useState("User Info");
  const [tickets, setTickets] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [profilePhoto, setProfilePhoto] = useState(
    user.profile_photo || "/assets/image.png"
  );
  const [username, setUsername] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (activeSection === "Tickets") {
      const fetchTickets = async () => {
        try {
          const response = await axios.get(
            `http://localhost:5000/api/tickets?user_id=${user.id}`
          );
          setTickets(response.data.tickets);
        } catch (error) {
          console.error("Failed to fetch tickets:", error);
        }
      };
      fetchTickets();
    } else if (activeSection === "Upcoming Events") {
      const fetchUpcomingEvents = async () => {
        try {
          const response = await axios.get(
            `http://localhost:5000/api/upcoming-events?user_id=${user.id}`
          );
          setUpcomingEvents(response.data.events);
        } catch (error) {
          console.error("Failed to fetch upcoming events:", error);
        }
      };
      fetchUpcomingEvents();
    }
  }, [activeSection, user.id]);

  const handleUpdateProfile = async () => {
    try {
      const formData = new FormData();
      formData.append("username", username);
      formData.append("email", email);
      if (file) {
        formData.append("profile_photo", file);
      }

      const response = await axios.put(
        `http://localhost:5000/api/profile/${user.id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.data.success) {
        alert("Profile updated successfully");
        localStorage.setItem(
          "user",
          JSON.stringify({
            ...user,
            name: username,
            email,
            profile_photo: response.data.profile_photo,
          })
        );
        setProfilePhoto(response.data.profile_photo);
      } else {
        alert("Failed to update profile");
      }
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login"); // Redirect to the login page
  };

  return (
    <div className="profile-page">
      {/* Sidebar */}
      <aside className="sidebar">
        <h2>User Profile</h2>
        <ul>
          <li
            className={activeSection === "User Info" ? "active" : ""}
            onClick={() => setActiveSection("User Info")}
          >
            User Info
          </li>
          <li
            className={activeSection === "Tickets" ? "active" : ""}
            onClick={() => setActiveSection("Tickets")}
          >
            Tickets
          </li>
          <li
            className={activeSection === "Upcoming Events" ? "active" : ""}
            onClick={() => setActiveSection("Upcoming Events")}
          >
            Upcoming Events
          </li>
          <li
            className={activeSection === "Notifications" ? "active" : ""}
            onClick={() => setActiveSection("Notifications")}
          >
            Notifications
          </li>
        </ul>
        <button className="logout" onClick={handleLogout}>
          Log out
        </button>
      </aside>

      {/* Main Content */}
      <main className="profile-content">
        {activeSection === "User Info" && (
          <div>
            <div className="profile-header">
              <img src={profilePhoto} alt="Profile" className="profile-image" />
              <div className="profile-details">
                <h3>{username}</h3>
                <p>{user.location || "Location not provided"}</p>
              </div>
            </div>

            <form className="profile-form" onSubmit={(e) => e.preventDefault()}>
              <div className="form-group">
                <label>Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                />
              </div>
              <div className="form-group">
                <label>Profile Photo</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFile(e.target.files[0])}
                />
              </div>
              <button type="button" onClick={handleUpdateProfile}>
                Save
              </button>
            </form>
          </div>
        )}

        {activeSection === "Tickets" && (
          <div>
            <h2>Ticket History</h2>
            <ul className="ticket-list">
              {tickets.map((ticket) => (
                <li key={ticket.id} className="ticket-item">
                  <h3>Exhibition: {ticket.exhibition_name}</h3>
                  <p>Date: {ticket.purchase_date}</p>
                  <p>Amount: {ticket.amount}</p>
                  <p>Payment ID: {ticket.payment_id}</p>
                  <p>Payment Mode: {ticket.payment_mode}</p>
                  <p>Payment Status: {ticket.payment_status}</p>
                </li>
              ))}
            </ul>
          </div>
        )}

        {activeSection === "Upcoming Events" && (
          <div>
            <h2>Upcoming Events</h2>
            <ul className="event-list">
              {upcomingEvents.map((event) => (
                <li key={event.id} className="event-item">
                  <h3>Event: {event.event_name}</h3>
                  <p>Date: {event.event_date}</p>
                  <p>Location: {event.location}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </main>
    </div>
  );
};

export default ProfilePage;
