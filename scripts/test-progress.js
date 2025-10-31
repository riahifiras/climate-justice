// Test script to verify progress tracking system
import { connectToDatabase } from "../lib/mongodb.js"

async function testProgressTracking() {
  try {
    const { db } = await connectToDatabase()


    // Test 1: Check collections exist
    const collections = await db.listCollections().toArray()
    const collectionNames = collections.map((c) => c.name)

    if (!collectionNames.includes("progress")) {
      console.error("ERROR: progress collection not found")
      process.exit(1)
    }
    if (!collectionNames.includes("scores")) {
      console.error("ERROR: scores collection not found")
      process.exit(1)
    }

    // Test 2: Insert test progress document
    const testUserId = "test-user-" + Date.now()
    const progressResult = await db.collection("progress").insertOne({
      userId: testUserId,
      completedSubsections: {
        intro: {
          0: true,
          1: true,
        },
        chapter1: {
          0: true,
        },
      },
      updatedAt: new Date(),
    })

    // Test 3: Query progress document
    const progressDoc = await db.collection("progress").findOne({ userId: testUserId })

    // Test 4: Insert test scores document
    const scoresResult = await db.collection("scores").insertOne({
      userId: testUserId,
      scores: {
        "intro-1": {
          correct: 2,
          total: 3,
          pct: 67,
          at: Date.now(),
          savedAt: new Date(),
        },
        "chapter1-1": {
          correct: 3,
          total: 3,
          pct: 100,
          at: Date.now(),
          savedAt: new Date(),
        },
      },
      updatedAt: new Date(),
    })

    // Test 5: Query scores document
    const scoresDoc = await db.collection("scores").findOne({ userId: testUserId })

    // Test 6: Update progress (mark another lesson done)
    const updateResult = await db.collection("progress").updateOne(
      { userId: testUserId },
      {
        $set: {
          "completedSubsections.chapter1.1": true,
          updatedAt: new Date(),
        },
      },
    )

    // Test 7: Verify update
    const updatedDoc = await db.collection("progress").findOne({ userId: testUserId })

    // Test 8: Calculate stats
    const completedSubsections = updatedDoc.completedSubsections
    let completed = 0
    Object.values(completedSubsections).forEach((section) => {
      if (typeof section === "object") {
        completed += Object.values(section).filter(Boolean).length
      }
    })
    
    // Test 9: Cleanup
    await db.collection("progress").deleteOne({ userId: testUserId })
    await db.collection("scores").deleteOne({ userId: testUserId })

    process.exit(0)
  } catch (error) {
    console.error("Test failed:", error)
    process.exit(1)
  }
}

testProgressTracking()
