const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const requireAuth = require("../middleware/auth");

// ── Helpers ───────────────────────────────────────────────────────────────────
const signToken = (user) =>
  jwt.sign(
    { id: user._id.toString(), email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );

// ── POST /api/auth/register ───────────────────────────────────────────────────
router.post("/register", async (req, res, next) => {
  try {
    const { name, email, phone, address, password, emergencyContacts = [] } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({ error: "name, email, phone and password are required." });
    }

    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return res.status(409).json({ error: "An account with this email already exists." });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone: phone.trim(),
      address: (address || "").trim(),
      passwordHash,
      emergencyContacts,
    });

    const token = signToken(user);
    res.status(201).json({ token, user: user.toJSON() });
  } catch (err) {
    next(err);
  }
});

// ── POST /api/auth/login ──────────────────────────────────────────────────────
router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required." });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    const valid = await user.comparePassword(password);
    if (!valid) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    const token = signToken(user);
    res.json({ token, user: user.toJSON() });
  } catch (err) {
    next(err);
  }
});

// ── GET /api/auth/me ──────────────────────────────────────────────────────────
router.get("/me", requireAuth, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found." });
    res.json({ user: user.toJSON() });
  } catch (err) {
    next(err);
  }
});

// ── PUT /api/auth/profile ─────────────────────────────────────────────────────
router.put("/profile", requireAuth, async (req, res, next) => {
  try {
    const { name, phone, address, emergencyContacts, vehicleConnected } = req.body;

    const updates = {};
    if (name !== undefined)               updates.name = name.trim();
    if (phone !== undefined)              updates.phone = phone.trim();
    if (address !== undefined)            updates.address = address.trim();
    if (emergencyContacts !== undefined)  updates.emergencyContacts = emergencyContacts;
    if (vehicleConnected !== undefined)   updates.vehicleConnected = vehicleConnected;

    const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true, runValidators: true });
    if (!user) return res.status(404).json({ error: "User not found." });

    res.json({ user: user.toJSON() });
  } catch (err) {
    next(err);
  }
});

// ── PUT /api/auth/password ────────────────────────────────────────────────────
router.put("/password", requireAuth, async (req, res, next) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ error: "oldPassword and newPassword are required." });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ error: "New password must be at least 6 characters." });
    }

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found." });

    const valid = await user.comparePassword(oldPassword);
    if (!valid) return res.status(401).json({ error: "Current password is incorrect." });

    user.passwordHash = await bcrypt.hash(newPassword, 12);
    await user.save();

    res.json({ message: "Password updated successfully." });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
