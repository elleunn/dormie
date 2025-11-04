import { init } from "../lib/db.js"

async function main() {
  try {
    console.log("Initializing database...")
    await init()
    console.log("Database initialized successfully!")
  } catch (err) {
    console.error("Error initializing database:", err)
    process.exit(1)
  }
}

main()
