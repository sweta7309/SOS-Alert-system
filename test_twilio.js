require('dotenv').config();
const twilio = require('twilio');

const twilioSid   = process.env.TWILIO_ACCOUNT_SID;
const twilioToken = process.env.TWILIO_AUTH_TOKEN;
const twilioFrom  = process.env.TWILIO_FROM_NUMBER;

console.log("SID:", twilioSid);
console.log("Token:", twilioToken ? "***" : "missing");
console.log("From:", twilioFrom);

const client = twilio(twilioSid, twilioToken);

async function test() {
  try {
    const message = await client.messages.create({
      body: "Test from Vitalink",
      from: twilioFrom,
      to: "+919830504060" // I will just try a random number to see if it gives unverified error
    });
    console.log("Success! SID:", message.sid);
  } catch (err) {
    console.error("Error sending SMS:", err.message);
  }
}

test();
