const express = require("express");
const path = require("path");
const { MongoClient } = require("mongodb");

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URL = process.env.MONGO_URL || "mongodb://admin:password@mongodb:27017/mydatabase?authSource=admin";
const DB_NAME = "user-account";

const client = new MongoClient(MONGO_URL);
let users; // the "users" collection

app.use(express.json());

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Read the profile (userid: 1) from MongoDB
app.get("/get-profile", async (req, res) => {
  try {
    const result = await users.findOne({ userid: 1 }, { projection: { _id: 0 } });
    res.json(result || { userid: 1, name: "", email: "", interests: "" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not read profile" });
  }
});

// Create or update the profile (userid: 1)
app.post("/update-profile", async (req, res) => {
  const name = String(req.body.name || "").trim();
  const email = String(req.body.email || "").trim();
  const interests = String(req.body.interests || "").trim();

  if (!name || !email) {
    return res.status(400).json({ error: "Name and email are required" });
  }

  try {
    await users.updateOne(
      { userid: 1 },
      { $set: { userid: 1, name, email, interests } },
      { upsert: true }
    );
    res.json({ userid: 1, name, email, interests });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not save profile" });
  }
});

async function start() {
  try {
    await client.connect();
    users = client.db(DB_NAME).collection("users");
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("Cannot connect to MongoDB:", err.message);
    console.error("Is the mongo container running on port 27017?");
    process.exit(1);
  }
  app.listen(PORT, () => console.log(`App listening on http://localhost:${PORT}`));
}

start();