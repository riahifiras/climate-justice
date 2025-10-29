// Initialize MongoDB collections and indexes
import { connectToDatabase } from "../lib/mongodb.js"

async function initializeDatabase() {
  try {
    const { db } = await connectToDatabase()

    // Create users collection
    try {
      await db.createCollection("users")
      console.log("Created users collection")
    } catch (e) {
      if (e.codeName !== "NamespaceExists") throw e
    }

    // Create indexes for users
    await db.collection("users").createIndex({ id: 1 }, { unique: true })
    await db.collection("users").createIndex({ email: 1 })
    console.log("Created users indexes")

    // Schema: { userId, completedSubsections: { sectionId: { subsectionIndex: true } }, updatedAt }
    try {
      await db.createCollection("progress")
      console.log("Created progress collection")
    } catch (e) {
      if (e.codeName !== "NamespaceExists") throw e
    }

    // Create indexes for progress
    await db.collection("progress").createIndex({ userId: 1 }, { unique: true })
    console.log("Created progress indexes")

    // Schema: { userId, scores: { subId: { correct, total, pct, at, savedAt } }, updatedAt }
    try {
      await db.createCollection("scores")
      console.log("Created scores collection")
    } catch (e) {
      if (e.codeName !== "NamespaceExists") throw e
    }

    // Create indexes for scores
    await db.collection("scores").createIndex({ userId: 1 }, { unique: true })
    console.log("Created scores indexes")

    console.log("Database initialization complete")
    console.log("\nSchema Documentation:")
    console.log("- progress: { userId, completedSubsections: { sectionId: { subsectionIndex: true } }, updatedAt }")
    console.log("- scores: { userId, scores: { subId: { correct, total, pct, at, savedAt } }, updatedAt }")

    process.exit(0)
  } catch (error) {
    console.error("Database initialization failed:", error)
    process.exit(1)
  }
}

initializeDatabase()
