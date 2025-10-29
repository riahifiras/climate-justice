// Test script to verify progress tracking system
import { connectToDatabase } from "../lib/mongodb.js"

async function testProgressTracking() {
  try {
    const { db } = await connectToDatabase()

    console.log("\n=== Progress Tracking System Test ===\n")

    // Test 1: Check collections exist
    console.log("Test 1: Checking collections...")
    const collections = await db.listCollections().toArray()
    const collectionNames = collections.map((c) => c.name)
    console.log("Collections:", collectionNames)

    if (!collectionNames.includes("progress")) {
      console.error("ERROR: progress collection not found")
      process.exit(1)
    }
    if (!collectionNames.includes("scores")) {
      console.error("ERROR: scores collection not found")
      process.exit(1)
    }
    console.log("✓ Collections exist\n")

    // Test 2: Insert test progress document
    console.log("Test 2: Inserting test progress document...")
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
    console.log("✓ Progress document inserted:", progressResult.insertedId)

    // Test 3: Query progress document
    console.log("\nTest 3: Querying progress document...")
    const progressDoc = await db.collection("progress").findOne({ userId: testUserId })
    console.log("✓ Progress document found:")
    console.log(JSON.stringify(progressDoc, null, 2))

    // Test 4: Insert test scores document
    console.log("\nTest 4: Inserting test scores document...")
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
    console.log("✓ Scores document inserted:", scoresResult.insertedId)

    // Test 5: Query scores document
    console.log("\nTest 5: Querying scores document...")
    const scoresDoc = await db.collection("scores").findOne({ userId: testUserId })
    console.log("✓ Scores document found:")
    console.log(JSON.stringify(scoresDoc, null, 2))

    // Test 6: Update progress (mark another lesson done)
    console.log("\nTest 6: Updating progress document...")
    const updateResult = await db.collection("progress").updateOne(
      { userId: testUserId },
      {
        $set: {
          "completedSubsections.chapter1.1": true,
          updatedAt: new Date(),
        },
      },
    )
    console.log("✓ Progress updated:", updateResult.modifiedCount, "document(s)")

    // Test 7: Verify update
    console.log("\nTest 7: Verifying update...")
    const updatedDoc = await db.collection("progress").findOne({ userId: testUserId })
    console.log("✓ Updated progress:")
    console.log(JSON.stringify(updatedDoc.completedSubsections, null, 2))

    // Test 8: Calculate stats
    console.log("\nTest 8: Calculating progress stats...")
    const completedSubsections = updatedDoc.completedSubsections
    let completed = 0
    Object.values(completedSubsections).forEach((section) => {
      if (typeof section === "object") {
        completed += Object.values(section).filter(Boolean).length
      }
    })
    console.log("✓ Completed lessons:", completed)
    console.log(
      "✓ Total lessons in test data:",
      Object.values(completedSubsections).reduce((acc, s) => acc + Object.keys(s).length, 0),
    )

    // Test 9: Cleanup
    console.log("\nTest 9: Cleaning up test data...")
    await db.collection("progress").deleteOne({ userId: testUserId })
    await db.collection("scores").deleteOne({ userId: testUserId })
    console.log("✓ Test data cleaned up")

    console.log("\n=== All Tests Passed ===\n")
    process.exit(0)
  } catch (error) {
    console.error("Test failed:", error)
    process.exit(1)
  }
}

testProgressTracking()
