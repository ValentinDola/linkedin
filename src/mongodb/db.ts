// Importing the mongoose library for MongoDB
import mongoose from "mongoose";

// Constructing the connection string using environment variables
const connectionString = `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@linkedin-tuto.mongocluster.cosmos.azure.com/?tls=true&authMechanism=SCRAM-SHA-256&retrywrites=false&maxIdleTimeMS=120000`;

// Checking if the connection string is provided
if (!connectionString) {
  throw new Error("Please provide a valid connection string");
}

// Async function to connect to the MongoDB database
const connectDB = async () => {
  // Checking if there is an active connection
  if (mongoose.connection?.readyState >= 1) {
    console.log("Already connected");
    return;
  }

  try {
    // Attempting to connect to the database
    console.log("-----Connecting to BD------");
    await mongoose.connect(connectionString);
    console.log("-----Connected to BD------");
  } catch (error) {
    // Handling connection errors
    console.log("Error connecting to mongodb: ", error);
  }
};

// Exporting the connectDB function as the default export
export default connectDB;
