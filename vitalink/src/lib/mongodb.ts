// MongoDB Atlas Data API Connector
// This module provides a fetch-based integration to MongoDB without needing npm packages.
// Requires: VITE_MONGODB_API_URL, VITE_MONGODB_API_KEY, VITE_MONGODB_CLUSTER, VITE_MONGODB_DATABASE

const API_URL = import.meta.env.VITE_MONGODB_API_URL;
const API_KEY = import.meta.env.VITE_MONGODB_API_KEY;
const CLUSTER = import.meta.env.VITE_MONGODB_CLUSTER || "Cluster0";
const DB = import.meta.env.VITE_MONGODB_DATABASE || "vitalink";

export const isMongoConfigured = () => {
  return !!(API_URL && API_KEY);
};

const fetchMongo = async (action: string, payload: any) => {
  if (!isMongoConfigured()) {
    throw new Error("MongoDB Data API not configured. Check your .env file.");
  }
  
  const response = await fetch(`${API_URL}/action/${action}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": API_KEY,
    },
    body: JSON.stringify({
      dataSource: CLUSTER,
      database: DB,
      ...payload
    }),
  });
  
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "MongoDB API request failed");
  }
  return data;
};

export const mongoApi = {
  findUserByEmail: async (email: string) => {
    const data = await fetchMongo("findOne", {
      collection: "users",
      filter: { email: { $regex: `^${email}$`, $options: "i" } }
    });
    return data.document;
  },
  
  findUserById: async (id: string) => {
    const data = await fetchMongo("findOne", {
      collection: "users",
      filter: { id: id }
    });
    return data.document;
  },

  createUser: async (user: any) => {
    const data = await fetchMongo("insertOne", {
      collection: "users",
      document: user
    });
    return data;
  },

  updateUser: async (id: string, updates: any) => {
    const data = await fetchMongo("updateOne", {
      collection: "users",
      filter: { id: id },
      update: { $set: updates }
    });
    return data;
  }
};
