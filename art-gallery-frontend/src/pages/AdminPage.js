import React, { useState, useEffect } from "react";
import axios from "axios";

const AdminPage = () => {
  const [artistName, setArtistName] = useState("");
  const [artistType, setArtistType] = useState("");
  const [artists, setArtists] = useState([]);
  const [exhibitionName, setExhibitionName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [artistId, setArtistId] = useState("");

  // Fetch artists on component mount
  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/artists");
        setArtists(response.data.artists);
      } catch (error) {
        console.error("Failed to fetch artists:", error);
      }
    };
    fetchArtists();
  }, []);

  const handleAddArtist = async () => {
    if (!artistName || !artistType) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/admin/add-artist",
        { name: artistName, type: artistType }
      );

      if (response.data.success) {
        alert("Artist added successfully.");
        setArtists([...artists, response.data.artist]);
        setArtistName("");
        setArtistType("");
      } else {
        alert(response.data.message || "Failed to add artist.");
      }
    } catch (error) {
      console.error("Add Artist error:", error.response?.data || error.message);
      alert("Failed to add artist. Check console for details.");
    }
  };

  const handleAddExhibition = async () => {
    if (!exhibitionName || !startDate || !endDate || !location || !artistId) {
      alert("Please fill in all required fields.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/admin/add-exhibition",
        {
          name: exhibitionName,
          start_date: startDate,
          end_date: endDate,
          location,
          description,
          artist_id: artistId,
        }
      );

      if (response.data.success) {
        alert("Exhibition added successfully.");
        setExhibitionName("");
        setStartDate("");
        setEndDate("");
        setLocation("");
        setDescription("");
        setArtistId("");
      } else {
        alert(response.data.message || "Failed to add exhibition.");
      }
    } catch (error) {
      console.error(
        "Add Exhibition error:",
        error.response?.data || error.message
      );
      alert("Failed to add exhibition. Check console for details.");
    }
  };

  return (
    <div>
      <h1>Admin Dashboard</h1>

      <div>
        <h2>Add Artist</h2>
        <input
          type="text"
          placeholder="Artist Name"
          value={artistName}
          onChange={(e) => setArtistName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Artist Type"
          value={artistType}
          onChange={(e) => setArtistType(e.target.value)}
        />
        <button onClick={handleAddArtist}>Add Artist</button>
      </div>

      <div>
        <h2>Add Exhibition</h2>
        <input
          type="text"
          placeholder="Exhibition Name"
          value={exhibitionName}
          onChange={(e) => setExhibitionName(e.target.value)}
        />
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>
        <select value={artistId} onChange={(e) => setArtistId(e.target.value)}>
          <option value="">Select Artist</option>
          {artists.map((artist) => (
            <option key={artist.id} value={artist.id}>
              {artist.name}
            </option>
          ))}
        </select>
        <button onClick={handleAddExhibition}>Add Exhibition</button>
      </div>
    </div>
  );
};

export default AdminPage;
