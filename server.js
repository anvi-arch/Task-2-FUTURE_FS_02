const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static("public"));
app.use(express.json());
app.use(express.static("public"));

// ADD THIS HERE
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/contact.html");
});

app.get("/admin", (req, res) => {
  res.sendFile(__dirname + "/public/admin.html");
});

// Import Lead Model
const Lead = require("./models/Lead");

// Test Route


// 🔹 Add New Lead API
app.post("/api/leads", async (req, res) => {
  try {
    const { name, email, source } = req.body;

    const newLead = new Lead({
      name,
      email,
      source
    });

    await newLead.save();

    res.status(201).json(newLead);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating lead" });
  }
});

// 🔹 Get All Leads
app.get("/api/leads", async (req, res) => {
  try {
    const leads = await Lead.find().sort({ createdAt: -1 });
    res.status(200).json(leads);
  } catch (error) {
    res.status(500).json({ message: "Error fetching leads" });
  }
});

// 🔹 Update Lead Status
app.put("/api/leads/:id/status", async (req, res) => {
  try {
    const { status } = req.body;

    const updatedLead = await Lead.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!updatedLead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    res.status(200).json(updatedLead);
  } catch (error) {
    res.status(500).json({ message: "Error updating status" });
  }
});

// 🔹 Add / Update Notes
app.put("/api/leads/:id/notes", async (req, res) => {
  try {
    const { notes } = req.body;

    const updatedLead = await Lead.findByIdAndUpdate(
      req.params.id,
      { notes },
      { new: true }
    );

    if (!updatedLead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    res.status(200).json(updatedLead);
  } catch (error) {
    res.status(500).json({ message: "Error updating notes" });
  }
});

// 🔹 Delete Lead
app.delete("/api/leads/:id", async (req, res) => {
  try {
    const deletedLead = await Lead.findByIdAndDelete(req.params.id);

    if (!deletedLead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    res.status(200).json({ message: "Lead deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting lead" });
  }
});

// Connect MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected ✅"))
  .catch((err) => console.log(err));

const PORT = 8000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});