export interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  relation: string;
  priority: number;
}

export interface User {
  id: string;
  name: string;
  phone: string;
  address: string;
  email: string;
  location?: {
    lat: number;
    lng: number;
  };
  emergencyContacts: EmergencyContact[];
  vehicleConnected: boolean;
  createdAt: string;
}

export interface Alert {
  id: string;
  userId: string;
  timestamp: string;
  location: {
    lat: number;
    lng: number;
  };
  type: "accident" | "manual";
  status: "pending" | "dispatched" | "resolved";
  notificationsSent: {
    police: boolean;
    ambulance: boolean;
    contacts: boolean;
  };
}
