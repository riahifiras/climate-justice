// Initialize MongoDB collections and indexes
import { connectToDatabase } from "../lib/mongodb.js"

async function initializeDatabase() {
  try {
    const { db } = await connectToDatabase()

    // Create users collection
    try {
      await db.createCollection("users")
    } catch (e) {
      if (e.codeName !== "NamespaceExists") throw e
    }

    // Create indexes for users
    await db.collection("users").createIndex({ id: 1 }, { unique: true })
    await db.collection("users").createIndex({ email: 1 })

    // Schema: { userId, completedSubsections: { sectionId: { subsectionIndex: true } }, updatedAt }
    try {
      await db.createCollection("progress")
    } catch (e) {
      if (e.codeName !== "NamespaceExists") throw e
    }

    // Create indexes for progress
    await db.collection("progress").createIndex({ userId: 1 }, { unique: true })

    // Schema: { userId, scores: { subId: { correct, total, pct, at, savedAt } }, updatedAt }
    try {
      await db.createCollection("scores")
    } catch (e) {
      if (e.codeName !== "NamespaceExists") throw e
    }

    // Create indexes for scores
    await db.collection("scores").createIndex({ userId: 1 }, { unique: true })


    process.exit(0)
  } catch (error) {
    console.error("Database initialization failed:", error)
    process.exit(1)
  }
}

initializeDatabase()
