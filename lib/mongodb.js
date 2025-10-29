// MongoDB connection utility
import { MongoClient } from "mongodb"

const MONGODB_URI = process.env.MONGODB_URI
const MONGODB_DB = process.env.MONGODB_DB || "climate-justice"

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable")
}

let cachedClient = null
let cachedDb = null

export async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb }
  }

  const client = new MongoClient(MONGODB_URI)
  await client.connect()
  const db = client.db(MONGODB_DB)

  cachedClient = client
  cachedDb = db

  return { client, db }
}

export async function getDatabase() {
  const { db } = await connectToDatabase()
  return db
}
