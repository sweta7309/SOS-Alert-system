# SOS Alert System (Ginne)

A smart emergency response system that allows users to quickly request help during danger or health-related situations using voice commands or device triggers.

## Overview

The system sends real-time location and alerts to predefined emergency contacts. It supports voice-based activation, hardware button triggers, and automated communication using APIs.

## Features

- Voice command activation:
  - "Hey Ginne Danger" → Alerts police and emergency contacts
  - "Hey Ginne Health" → Alerts ambulance and emergency contacts

- Real-time GPS location sharing

- Automatic call and SMS alerts using Twilio

- Physical button triggers:
  - Power + Volume Up → Danger emergency
  - Power + Volume Down → Health emergency

- 10-second cancel option:
  - Say "Emergency Call Deactivate" to stop alert

- Custom emergency contact priority system

## Tech Stack

- Frontend: React.js  
- Backend: Node.js / Express  
- Database: MongoDB  
- APIs: Twilio, GPS, Speech-to-Text  

## How It Works

1. User triggers emergency using voice or buttons  
2. System identifies emergency type (Danger or Health)  
3. Fetches live GPS location  
4. Sends SMS and makes calls to emergency contacts  

## Installation

```bash
git clone https://github.com/your-username/SOS-Alert-system.git
cd SOS-Alert-system
npm install
npm start
