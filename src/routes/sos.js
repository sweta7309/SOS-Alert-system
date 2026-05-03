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
  const loc = location
    ? `https://maps.google.com/?q=${location.lat},${location.lng}`
    : "Location unavailable";

  if (type === "danger") {
    return `🚨 EMERGENCY ALERT (DANGER)

${user.name} is in DANGER ⚠️
📞 Phone: ${user.phone}

📍 Location:
${loc}

Please respond immediately!`;
  }

  return `🚑 HEALTH EMERGENCY

${user.name} needs urgent medical help 🏥
📞 Phone: ${user.phone}

📍 Location:
${loc}

Please take action immediately!`;
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
        return ["police", "parent", "guardian"].includes(rel);
      });
    } else if (type === "health") {
      filteredContacts = contacts.filter((c) => {
        const rel = normalizeRelation(c.relation);
        return ["ambulance", "parent", "guardian"].includes(rel);

      });
    }

    // Debug (VERY IMPORTANT)
    console.log("🚨 SOS TYPE:", type);
    console.log(
      "Sending to:",
       filteredContacts.map((c) => `${c.name} (${c.relation})`)
    );

    if (!filteredContacts.length) {
      console.warn("⚠️ No contacts matched for type:", type);
    
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
    const results = [];

    for (const contact of filteredContacts) {
      const to = toE164(contact.phone);
    
      try {
        if (!client) {
          console.warn(`[DEMO] Would send to ${contact.name} (${contact.relation})`);
          results.push({ status: "fulfilled" });
          continue;
        }
    
        // SEND SMS
        console.log("💬 Sending SMS to:", contact.name, to);
        const message = await client.messages.create({
          body,
          from: twilioFrom,
          to,
        });
    
        // CALL
        console.log("📞 Calling:", contact.name, to);
        let voiceParts = [];

if (type === "danger") {
  voiceParts = [
    "Danger emergency.",
    "Immediate response required.",
    `${user.name} is in danger.`,
    "The location has been shared with you in the message.",
    "Please act immediately."
  ];
} else {
  voiceParts = [
    "Health emergency.",
    "Immediate response required.",
    `${user.name} needs urgent medical help.`,
    "The location has been shared with you in the message.",
    "Please respond immediately."
  ];
}
const twimlResponse = `
<Response>
  ${voiceParts
    .map(
      (line) => `
    <Say voice="alice" language="en-IN" rate="85%">
      ${line}
    </Say>
    <Pause length="1.5"/>
  `
    )
    .join("")}
</Response>
`;
        // create message FIRST
        
        await client.calls.create({
        to,
        from: twilioFrom,
        twiml: twimlResponse,
      });

    
        // Delay (VERY IMPORTANT for trial)
        await new Promise((r) => setTimeout(r, 1500));
    
        results.push({ status: "fulfilled", sid: message.sid });
    
      } catch (err) {
        console.error("❌ Failed for", contact.name, err.message);
        results.push({ status: "rejected" });
      }
    }
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