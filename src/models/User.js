const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// ── EmergencyContact sub-schema ───────────────────────────────────────────────
const EmergencyContactSchema = new mongoose.Schema(
  {
    id:       { type: String, required: true },
    name:     { type: String, required: true },
    phone:    { type: String, required: true },
    relation: { type: String, required: true },
    priority: { type: Number, required: true },
  },
  { _id: false }
);

// ── User schema ───────────────────────────────────────────────────────────────
const UserSchema = new mongoose.Schema(
  {
    name:              { type: String, required: true, trim: true },
    email:             { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone:             { type: String, required: true, trim: true },
    address:           { type: String, default: "" },
    passwordHash:      { type: String, required: true },
    emergencyContacts: { type: [EmergencyContactSchema], default: [] },
    vehicleConnected:  { type: Boolean, default: false },
    authProvider:      { type: String, enum: ["local", "google"], default: "local" },
  },
  { timestamps: true }
);

// ── Instance methods ──────────────────────────────────────────────────────────
UserSchema.methods.comparePassword = async function (plain) {
  return bcrypt.compare(plain, this.passwordHash);
};

// ── toJSON — strip sensitive fields ──────────────────────────────────────────
UserSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: (_doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.passwordHash;
    return ret;
  },
});

module.exports = mongoose.model("User", UserSchema);
