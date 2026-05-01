# Vehicle Accident Alert System

A modern, responsive web application that automatically sends emergency alerts when a vehicle accident is detected. The system connects vehicles to users' phones and instantly notifies police, ambulance services, and priority emergency contacts with GPS location data.

## 🚨 Project Overview

The Vehicle Accident Alert System provides:
- **Automatic Accident Detection** via vehicle sensors (simulated in demo mode)
- **Instant Emergency Notifications** to police, ambulance, and family contacts
- **Real-time GPS Location Sharing** with Google Maps integration
- **Priority-based Contact System** (up to 4 emergency contacts)
- **Visual & Audio Alert Beacons** for nearby assistance
- **Demo Mode** for testing without sending real alerts

## 🎯 Features

### Core Functionality
- ✅ User registration with emergency contact management
- ✅ GPS location tracking and permission handling
- ✅ Vehicle connection simulation (demo mode)
- ✅ Accident trigger and alert system
- ✅ Real-time location sharing via Google Maps
- ✅ Priority-based emergency contact notifications
- ✅ Visual emergency beacon effects
- ✅ User dashboard with system status
- ✅ Responsive mobile-first design

### Pages
- **Home** - Hero section, features overview, stats
- **Features** - Detailed feature descriptions
- **About** - Mission, values, technology explanation
- **Contact** - Contact form and support information
- **Register** - Two-step registration with emergency contacts
- **Dashboard** - User profile, system status, location tracking
- **Accident Simulator** - Demo mode for testing alerts

## 🛠️ Technology Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **shadcn/ui** component library
- **React Router** for navigation
- **Geolocation API** for GPS tracking

### Design System
- Emergency-themed color palette (Red, Blue, Amber)
- Custom animations (pulse, beacon, fade-in)
- Semantic design tokens
- Responsive breakpoints
- Dark mode support

## 📦 Installation & Setup

### Prerequisites
- Node.js 16+ and npm installed ([install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating))
- Modern web browser with GPS support

### Quick Start

```bash
# Clone the repository
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:8080`

### Build for Production

```bash
# Create optimized production build
npm run build

# Preview production build locally
npm run preview
```

## 🔧 Configuration

### Demo Mode
The application runs in **DEMO_MODE** by default, which means:
- No actual SMS or phone calls are sent
- All emergency notifications are logged to console
- Simulated vehicle sensors instead of real hardware
- Test data can be used without consequences

### GPS Permissions
The app requires GPS location access:
1. Browser will prompt for location permission on first use
2. Grant "Allow" to enable GPS tracking
3. Location is only tracked when needed (not continuously)

### Emergency Contacts
During registration, you can add up to 4 emergency contacts:
1. **Priority 1** - Typically Police
2. **Priority 2** - Typically Ambulance
3. **Priority 3** - Typically Parents/Family
4. **Priority 4** - Other emergency contact

## 🎮 Usage Guide

### 1. Registration
1. Navigate to "Get Started" or `/register`
2. Fill in personal information (name, email, phone, address)
3. Add emergency contacts with priority ordering
4. Complete registration

### 2. Dashboard
- View your system status
- Check GPS location
- Manage emergency contacts
- Access quick actions

### 3. Testing the System
1. Go to `/simulator` (Accident Simulator)
2. Click "Connect Simulated Vehicle"
3. Ensure GPS permission is granted
4. Click "Trigger Emergency Alert"
5. Review the alert modal with simulated notifications

## 🔒 Security & Privacy

### Current Implementation (Demo)
- Data stored in browser localStorage
- No backend database
- Location data not persisted
- No actual emergency services contacted

### Production Considerations
For real-world deployment, implement:
- **Backend Authentication** (Firebase Auth or similar)
- **Database** (Firestore/PostgreSQL) for user data
- **Encrypted Storage** for sensitive contact information
- **HTTPS** for all communications
- **Rate Limiting** to prevent abuse
- **Two-Factor Authentication** for account access
- **GDPR Compliance** for data protection

## 📞 Backend Integration (For Production)

### Option 1: Firebase
```javascript
// Install Firebase
npm install firebase

// Configure Firebase
// Initialize Firebase app
// Set up Firestore for data
// Use Cloud Functions for SMS/Calls via Twilio
// Enable Firebase Authentication
```

**Firestore Schema:**
```
users/{userId}
  - name: string
  - email: string
  - phone: string
  - address: string
  - location: { lat: number, lng: number }
  - emergencyContacts: array
  - vehicleConnected: boolean
  - createdAt: timestamp

alerts/{alertId}
  - userId: string
  - timestamp: timestamp
  - location: { lat: number, lng: number }
  - type: "accident" | "manual"
  - status: "pending" | "dispatched" | "resolved"
```

### Option 2: Node.js + Express
```javascript
// Install dependencies
npm install express twilio cors dotenv

// Create REST endpoints:
// POST /api/register - Create new user
// POST /api/alert - Trigger emergency alert
// GET /api/user/:id - Get user data
```

### SMS & Calling Integration (Twilio)

**Setup:**
1. Sign up at [twilio.com](https://twilio.com)
2. Get Account SID and Auth Token
3. Verify phone numbers for testing
4. Store credentials in environment variables

**Example Edge Function (Firebase):**
```javascript
import * as functions from "firebase-functions";
import * as twilio from "twilio";

const client = twilio(
  functions.config().twilio.sid,
  functions.config().twilio.token
);

export const sendEmergencyAlert = functions.https.onCall(async (data) => {
  const { contacts, location, userName } = data;
  
  // Send SMS to each contact
  for (const contact of contacts) {
    await client.messages.create({
      to: contact.phone,
      from: functions.config().twilio.phone,
      body: `EMERGENCY: ${userName} has been in an accident. Location: https://maps.google.com/?q=${location.lat},${location.lng}`
    });
    
    // Make voice call
    await client.calls.create({
      to: contact.phone,
      from: functions.config().twilio.phone,
      url: 'http://your-server.com/emergency-voice.xml'
    });
  }
  
  return { success: true };
});
```

### Environment Variables
Create `.env.example`:
```bash
# Twilio
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=+1234567890

# Google Maps (optional)
VITE_GOOGLE_MAPS_API_KEY=your_maps_api_key

# Firebase (if using)
VITE_FIREBASE_API_KEY=your_firebase_key
VITE_FIREBASE_AUTH_DOMAIN=your-app.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
```

## 🗺️ Maps Integration

### Current Implementation
- Uses browser Geolocation API
- Generates Google Maps links manually
- No interactive map component

### Enhanced Map Integration (Optional)

**Option A: Google Maps JavaScript API**
```bash
npm install @googlemaps/react-wrapper
```

**Option B: Leaflet (Open Source)**
```bash
npm install react-leaflet leaflet
```

## 🧪 Testing

### Manual Testing
1. Test registration flow with various inputs
2. Grant/deny GPS permissions and verify handling
3. Trigger accident alerts and check console logs
4. Test on multiple devices and screen sizes
5. Verify responsive design breakpoints

### Automated Testing (Future)
```bash
# Install testing dependencies
npm install --save-dev @testing-library/react @testing-library/jest-dom vitest

# Run tests
npm run test
```

**Example Test:**
```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import Register from './pages/Register';

test('registration form validates required fields', async () => {
  render(<Register />);
  
  const submitButton = screen.getByText('Continue to Emergency Contacts');
  fireEvent.click(submitButton);
  
  // Should show validation errors
  expect(screen.getByText('Please fill in all required fields')).toBeInTheDocument();
});
```

## 🚀 Deployment

### Option 1: Vercel (Recommended)
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

### Option 2: Firebase Hosting
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login and initialize
firebase login
firebase init hosting

# Deploy
npm run build
firebase deploy --only hosting
```

### Option 3: Netlify
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
npm run build
netlify deploy --prod
```

## ⚠️ Important Legal & Safety Notes

### Disclaimers
1. **This is a demonstration system** - not certified for actual emergency use
2. **Real emergency calling** must use approved telecommunication providers
3. **Comply with local laws** regarding emergency services and data privacy
4. **Test responsibly** - never trigger false emergency alerts to real services
5. **Vehicle integration** requires professional installation and certification
6. **No guarantee** - this system should supplement, not replace, standard safety equipment

### Liability
- Users assume all responsibility for system testing and deployment
- Always call 911 or local emergency services directly when possible
- This demo is for educational and development purposes only

## 🤝 Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - See LICENSE file for details

## 📞 Support

- **Email:** support@accidentalert.com
- **Phone:** +1 (555) 123-4567
- **Documentation:** [View detailed docs](https://docs.lovable.dev)

## 🔗 Useful Links

- [Twilio Documentation](https://www.twilio.com/docs)
- [Google Maps API](https://developers.google.com/maps/documentation)
- [Geolocation API](https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API)
- [Firebase Documentation](https://firebase.google.com/docs)

---

**Remember:** This is a demo system. For production deployment, work with certified professionals and ensure compliance with all applicable regulations and safety standards.
