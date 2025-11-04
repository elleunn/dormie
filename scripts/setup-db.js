import { neon } from "@neondatabase/serverless"

async function setupDatabase() {
  if (!process.env.DATABASE_URL) {
    console.error("[v0] DATABASE_URL environment variable is not set")
    process.exit(1)
  }

  const sql = neon(process.env.DATABASE_URL)

  try {
    console.log("[v0] Creating tables...")

    // Create bookings table based on your db.js functions
    await sql`
      CREATE TABLE IF NOT EXISTS bookings (
        id SERIAL PRIMARY KEY,
        rooms_name VARCHAR(255) NOT NULL,
        arrived_date DATE NOT NULL,
        floor_no INTEGER NOT NULL,
        bed_no INTEGER NOT NULL,
        status VARCHAR(50) DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `

    console.log("[v0] Bookings table created successfully")

    // Insert sample data
    await sql`
      INSERT INTO bookings (rooms_name, arrived_date, floor_no, bed_no, status)
      VALUES 
        ('Room 101', '2024-11-05', 1, 1, 'active'),
        ('Room 102', '2024-11-04', 1, 2, 'active'),
        ('Room 201', '2024-11-03', 2, 1, 'inactive')
      ON CONFLICT DO NOTHING;
    `

    console.log("[v0] Sample data inserted")
    console.log("[v0] Database setup complete!")
    process.exit(0)
  } catch (error) {
    console.error("[v0] Database setup failed:", error.message)
    process.exit(1)
  }
}

setupDatabase()
