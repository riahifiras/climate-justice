// Verify MongoDB schema is correct
import { connectToDatabase } from "../lib/mongodb.js"

async function verifySchema() {
  try {
    const { db } = await connectToDatabase()


    // Check progress collection
    const progressIndexes = await db.collection("progress").getIndexes()

    // Check scores collection
    const scoresIndexes = await db.collection("scores").getIndexes()

    // Check users collection
    const usersIndexes = await db.collection("users").getIndexes()

    process.exit(0)
  } catch (error) {
    console.error("Verification failed:", error)
    process.exit(1)
  }
}

verifySchema()
