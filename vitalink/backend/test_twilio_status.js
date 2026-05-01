require('dotenv').config();
const twilio = require('twilio');

const twilioSid   = process.env.TWILIO_ACCOUNT_SID;
const twilioToken = process.env.TWILIO_AUTH_TOKEN;

const client = twilio(twilioSid, twilioToken);

async function checkStatus(sid) {
  try {
    const message = await client.messages(sid).fetch();
    console.log(`SID: ${sid}`);
    console.log(`Status: ${message.status}`);
    console.log(`Error Code: ${message.errorCode}`);
    console.log(`Error Message: ${message.errorMessage}`);
    console.log(`To: ${message.to}`);
    console.log('---');
  } catch (err) {
    console.error(`Error fetching ${sid}:`, err.message);
  }
}

async function main() {
  await checkStatus('SM00b0a5c5e20317e9b354f7a9ab91fec6');
  await checkStatus('SM9731081e7a2f5fa5226a7cfd1525f1e9');
}

main();
