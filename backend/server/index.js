import express from 'express';
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import cors from 'cors';

// Load environment variables from .env file
dotenv.config();

const app = express();
app.use(cors());

// Initialize MongoDB client
const client = new MongoClient(process.env.MONGODB_URI);

// Function to load data from the database
async function loadData() {
    try {
        const db = client.db("sentenceverificationbridging");
        const section1 = await db.collection("section-1").find().toArray();
        const section2 = await db.collection("section-2").find().toArray();
        return { "section-1": section1, "section-2": section2 };
    } catch (err) {
        console.error("Failed to fetch data:", err);
        return { error: "Failed to load data" };
    }
}

// API endpoint to fetch sections data
app.get('/api/sections', async (req, res) => {
    const data = await loadData();
    res.json(data);
});

// Define the server port
const PORT = process.env.PORT || 5000;

// Start the server and connect to MongoDB
app.listen(PORT, async () => {
    try {
        await client.connect();
        console.log("Connected to MongoDB and server running on port", PORT);
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }
});
