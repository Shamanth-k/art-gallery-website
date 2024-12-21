const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");
const mysql = require("mysql2");
const bcrypt = require("bcryptjs");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

// Set up multer for file uploads
const storage = multer.memoryStorage(); // Use memory storage to handle file uploads
const upload = multer({ storage });

// Database connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "sk1992004",
  database: "art_gallery",
});

db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err);
    return;
  }
  console.log("Connected to database successfully!");
});

// Default profile photo URL
const defaultProfilePhoto = "/assets/image.png";

// Login API
app.post("/api/login", async (req, res) => {
  try {
    const { email, password, role } = req.body;
    const [results] = await db
      .promise()
      .query("SELECT * FROM users WHERE email = ?", [email]);

    if (results.length === 0) {
      return res
        .status(401)
        .json({ success: false, message: "User not found" });
    }

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid password" });
    }

    if (user.role !== role) {
      return res.status(401).json({ success: false, message: "Invalid role" });
    }

    res.json({
      success: true,
      message: "Login successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        profile_photo: user.profile_photo
          ? `data:image/jpeg;base64,${user.profile_photo.toString("base64")}`
          : defaultProfilePhoto, // Include the profile photo
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ success: false, message: "Login failed" });
  }
});

// Registration API
app.post("/api/register", async (req, res) => {
  try {
    const { email, username, password, role } = req.body;

    // Check if email exists
    const [existingUsers] = await db
      .promise()
      .query("SELECT * FROM users WHERE email = ?", [email]);

    if (existingUsers.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user
    const [result] = await db
      .promise()
      .query(
        "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
        [username, email, hashedPassword, role]
      );

    res.json({
      success: true,
      message: "User registered successfully",
      userId: result.insertId,
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      success: false,
      message: "Registration failed",
      error: error.message,
    });
  }
});

// Get User Profile
app.get("/api/profile/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const [results] = await db
      .promise()
      .query(
        "SELECT id, name, email, role, profile_photo FROM users WHERE id = ?",
        [userId]
      );

    if (results.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const user = results[0];
    user.profile_photo = user.profile_photo
      ? `data:image/jpeg;base64,${user.profile_photo.toString("base64")}`
      : defaultProfilePhoto;

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Profile retrieval error:", error);
    res.status(500).json({
      success: false,
      message: "Profile retrieval failed",
    });
  }
});

// Update User Profile
app.put(
  "/api/profile/:userId",
  upload.single("profile_photo"),
  async (req, res) => {
    try {
      const userId = req.params.userId;
      const { username, email } = req.body;
      const profilePhoto = req.file ? req.file.buffer : null;

      let updateQuery = "UPDATE users SET name = ?, email = ? WHERE id = ?";
      let updateValues = [username, email, userId];

      if (profilePhoto) {
        updateQuery =
          "UPDATE users SET name = ?, email = ?, profile_photo = ? WHERE id = ?";
        updateValues.splice(2, 0, profilePhoto);
      }

      const [results] = await db.promise().query(updateQuery, updateValues);

      if (results.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      res.json({
        success: true,
        message: "Profile updated successfully",
        profile_photo: profilePhoto
          ? `data:image/jpeg;base64,${profilePhoto.toString("base64")}`
          : defaultProfilePhoto,
      });
    } catch (error) {
      console.error("Profile update error:", error);
      res.status(500).json({
        success: false,
        message: "Profile update failed",
      });
    }
  }
);

// Logout API
app.post("/api/logout", (req, res) => {
  // Since we are using local storage for user data, there's no server-side session to invalidate
  // This endpoint can be used to perform any server-side logout logic if needed
  res.json({
    success: true,
    message: "Logout successful",
  });
});

// Add Exhibition API
app.post("/api/admin/add-exhibition", async (req, res) => {
  try {
    const { name, start_date, end_date, location, description, artist_id } =
      req.body;

    if (!name || !start_date || !end_date || !location || !artist_id) {
      return res.status(400).json({
        success: false,
        message: "All fields are required except description",
      });
    }

    const [result] = await db
      .promise()
      .query(
        "INSERT INTO exhibitions (name, start_date, end_date, location, description, artist_id) VALUES (?, ?, ?, ?, ?, ?)",
        [name, start_date, end_date, location, description || "", artist_id]
      );

    res.json({
      success: true,
      message: "Exhibition added successfully",
      exhibition: {
        id: result.insertId,
        name,
        start_date,
        end_date,
        location,
        description,
        artist_id,
      },
    });
  } catch (error) {
    console.error("Add Exhibition error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add exhibition",
      error: error.message,
    });
  }
});

// Add Artist API
app.post("/api/admin/add-artist", async (req, res) => {
  try {
    const { name, type } = req.body;

    if (!name || !type) {
      return res.status(400).json({
        success: false,
        message: "Artist name and type are required",
      });
    }

    const [result] = await db
      .promise()
      .query("INSERT INTO artists (name, type) VALUES (?, ?)", [name, type]);

    res.json({
      success: true,
      message: "Artist added successfully",
      artist: { id: result.insertId, name, type },
    });
  } catch (error) {
    console.error("Add Artist error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add artist",
      error: error.message,
    });
  }
});

// Get Exhibitions API
app.get("/api/exhibitions", async (req, res) => {
  try {
    const [results] = await db.promise().query("SELECT * FROM exhibitions");
    res.json({
      success: true,
      exhibitions: results,
    });
  } catch (error) {
    console.error("Get Exhibitions error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve exhibitions",
      error: error.message,
    });
  }
});

// Get Artists API
app.get("/api/artists", async (req, res) => {
  try {
    const [results] = await db.promise().query("SELECT * FROM artists");
    res.json({
      success: true,
      artists: results,
    });
  } catch (error) {
    console.error("Get Artists error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve artists",
      error: error.message,
    });
  }
});

// Get Exhibition Details API
app.get("/api/exhibitions/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [results] = await db
      .promise()
      .query("SELECT * FROM exhibitions WHERE id = ?", [id]);
    if (results.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Exhibition not found" });
    }
    res.json({
      success: true,
      exhibition: results[0],
    });
  } catch (error) {
    console.error("Get Exhibition Details error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve exhibition details",
      error: error.message,
    });
  }
});

// Add Review API
app.post("/api/reviews", async (req, res) => {
  try {
    const { exhibition_id, user_id, rating, comments, review_date } = req.body;
    const [result] = await db
      .promise()
      .query(
        "INSERT INTO reviews (exhibition_id, user_id, rating, comments, review_date) VALUES (?, ?, ?, ?, ?)",
        [exhibition_id, user_id, rating, comments, review_date]
      );
    res.json({
      success: true,
      message: "Review added successfully",
      reviewId: result.insertId,
    });
  } catch (error) {
    console.error("Add Review error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add review",
      error: error.message,
    });
  }
});

// Purchase Ticket API
app.post("/api/tickets", async (req, res) => {
  try {
    const {
      exhibition_id,
      user_id,
      amount,
      payment_id,
      payment_mode,
      payment_status,
    } = req.body;
    const [result] = await db
      .promise()
      .query(
        "INSERT INTO tickets (exhibition_id, user_id, amount, payment_id, payment_mode, payment_status) VALUES (?, ?, ?, ?, ?, ?)",
        [
          exhibition_id,
          user_id,
          amount,
          payment_id,
          payment_mode,
          payment_status,
        ]
      );
    res.json({
      success: true,
      message: "Ticket purchased successfully",
      ticketId: result.insertId,
    });
  } catch (error) {
    console.error("Purchase Ticket error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to purchase ticket",
      error: error.message,
    });
  }
});

// Get Tickets by User ID API
app.get("/api/tickets", async (req, res) => {
  try {
    const { user_id } = req.query;
    const [results] = await db
      .promise()
      .query(
        "SELECT t.*, e.name as exhibition_name FROM tickets t JOIN exhibitions e ON t.exhibition_id = e.id WHERE t.user_id = ?",
        [user_id]
      );
    res.json({
      success: true,
      tickets: results,
    });
  } catch (error) {
    console.error("Get Tickets error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve tickets",
      error: error.message,
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Something went wrong!",
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
