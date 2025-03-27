import mongoose from "mongoose";
import dotenv from "dotenv";
import Task from "./models/Task";

dotenv.config(); // Load environment variables

const MONGO_URI = process.env.MONGO_URI || "mongodb://admin:secret@localhost:27017";

const seedData = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");

    // **Clear Existing Data (Optional)**
    await Task.deleteMany({});
    console.log("Existing data cleared.");

    // **Sample Tasks**
    const tasks = [
      { title: "Buy groceries", completed: false, priority: "high" },
      { title: "Complete project", completed: false, priority: "medium" },
      { title: "Workout", completed: false, priority: "low" }
    ];

    // **Insert Data**
    await Task.insertMany(tasks);
    console.log("Seed data inserted successfully!");

    process.exit(); // Exit after completion
  } catch (error) {
    console.error("Error seeding data:", error);
    process.exit(1); // Exit with failure
  }
};

seedData();
