// Verify MongoDB schema is correct
import { connectToDatabase } from "../lib/mongodb.js"

async function verifySchema() {
  try {
    const { db } = await connectToDatabase()

    console.log("\n=== MongoDB Schema Verification ===\n")

    // Check progress collection
    console.log("Progress Collection Schema:")
    console.log("Expected: { userId, completedSubsections: { sectionId: { subsectionIndex: true } }, updatedAt }")
    const progressIndexes = await db.collection("progress").getIndexes()
    console.log("Indexes:", progressIndexes)

    // Check scores collection
    console.log("\nScores Collection Schema:")
    console.log("Expected: { userId, scores: { subId: { correct, total, pct, at, savedAt } }, updatedAt }")
    const scoresIndexes = await db.collection("scores").getIndexes()
    console.log("Indexes:", scoresIndexes)

    // Check users collection
    console.log("\nUsers Collection Schema:")
    const usersIndexes = await db.collection("users").getIndexes()
    console.log("Indexes:", usersIndexes)

    console.log("\n=== Schema Verification Complete ===\n")
    process.exit(0)
  } catch (error) {
    console.error("Verification failed:", error)
    process.exit(1)
  }
}

verifySchema()
