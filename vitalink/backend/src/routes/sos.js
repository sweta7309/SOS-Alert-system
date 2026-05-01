const router = require("express").Router();
const twilio = require("twilio");
const User = require("../models/User");
const requireAuth = require("../middleware/auth");

// ── Helpers ─────────────────────────────────────────

function toE164(phone) {
  const digits = phone.replace(/\D/g, "");
  if (phone.startsWith("+")) return "+" + digits;
  const prefix = (process.env.DEFAULT_COUNTRY_CODE || "+91").replace(/\D/g, "");
  return "+" + prefix + digits;
}

function buildSmsBody(user, type, location) {
  const t = type === "health" ? "HEALTH" : "DANGER";
  const loc = location
    ? `${location.lat.toFixed(4)},${location.lng.toFixed(4)}`
    : "Unknown";

  return `SOS: ${t}!\n${user.name} (${user.phone})\nLoc: maps.google.com/?q=${loc}`;
}

// Normalize relation (IMPORTANT FIX)
function normalizeRelation(rel) {
  return (rel || "").trim().toLowerCase();
}

// ── ROUTE ───────────────────────────────────────────

router.post("/trigger", requireAuth, async (req, res, next) => {
  try {
    const { type = "danger", location } = req.body;

    if (!["health", "danger"].includes(type)) {
      return res.status(400).json({ error: "Invalid type" });
    }

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    const contacts = user.emergencyContacts || [];

    // FILTER LOGIC (FIXED + SAFE)
    let filteredContacts = [];

    if (type === "danger") {
      filteredContacts = contacts.filter((c) => {
        const rel = normalizeRelation(c.relation);
        return rel === "police" || rel === "parent" || rel === "guardian";
      });
    } else if (type === "health") {
      filteredContacts = contacts.filter((c) => {
        const rel = normalizeRelation(c.relation);
        return rel === "ambulance" || rel === "parent" || rel === "guardian";
      });
    }

    // Debug (VERY IMPORTANT)
    console.log(
      "Sending to:",
       filteredContacts.map((c) => `${c.name} (${c.relation})`)
    );

    if (!filteredContacts.length) {
      return res.status(400).json({
        error: "No valid contacts for this emergency type",
      });
    }

    // ── Twilio Setup ────────────────────────────────
    const twilioSid = process.env.TWILIO_ACCOUNT_SID;
    const twilioToken = process.env.TWILIO_AUTH_TOKEN;
    const twilioFrom = process.env.TWILIO_FROM_NUMBER;

    const client =
      twilioSid && twilioToken && twilioFrom
        ? twilio(twilioSid, twilioToken)
        : null;

    const body = buildSmsBody(user, type, location);

    // ── SEND ALERTS ────────────────────────────────
    const results = await Promise.allSettled(
      filteredContacts.map(async (contact) => {
        const to = toE164(contact.phone);

        if (!client) {
          console.warn(`[DEMO] Would send to ${contact.name} (${contact.relation})`);
          return { contact: contact.name, status: "demo" };
        }

        // SEND SMS
        const message = await client.messages.create({
          body,
          from: twilioFrom,
          to,
        });

        // CALL only Police or Ambulance
        const rel = normalizeRelation(contact.relation);
        if (rel === "police" || rel === "ambulance") {
          await client.calls.create({
            to,
            from: twilioFrom,
            twiml: `<Response><Say>Emergency! ${user.name} needs immediate help.</Say></Response>`,
          });
        }

        return {
          contact: contact.name,
          status: "sent",
          sid: message.sid,
        };
      })
    );

    // ── RESULT SUMMARY ─────────────────────────────
    const sent = results.filter((r) => r.status === "fulfilled").length;
    const failed = results.filter((r) => r.status === "rejected").length;

    res.json({
      success: true,
      type,
      totalContacts: filteredContacts.length, // FIXED
      sent,
      failed,
    });
  } catch (err) {
    next(err);
  }
});

  // ── UPDATE CONTACT (ADD THIS BELOW /trigger) ─────────────────────────

router.put("/contact/:id", requireAuth, async (req, res) => {
  try {
    const { phone } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const contact = user.emergencyContacts.id(req.params.id);

    if (!contact) {
      return res.status(404).json({ error: "Contact not found" });
    }

    contact.phone = phone;

    await user.save();

    res.json({ success: true });
  } catch (err) {
    console.error("Update Contact Error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;