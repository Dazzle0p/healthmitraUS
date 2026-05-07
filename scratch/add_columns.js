require('dotenv').config({ path: '.env' });
const { Client } = require('pg');

async function run() {
  const connectionString = process.env.DATABASE_URL; // Next.js + Supabase sometimes uses DATABASE_URL
  
  if (!connectionString) {
    console.error("DATABASE_URL is not set in .env");
    process.exit(1);
  }

  const client = new Client({
    connectionString,
  });

  try {
    await client.connect();
    console.log("Connected to database.");

    await client.query(`
      ALTER TABLE plans ADD COLUMN IF NOT EXISTS allowed_services JSONB DEFAULT '[]'::jsonb;
    `);
    console.log("Added allowed_services column.");

    await client.query(`
      ALTER TABLE plans ADD COLUMN IF NOT EXISTS category_ids JSONB DEFAULT '[]'::jsonb;
    `);
    console.log("Added category_ids column.");

    // Supabase needs to reload schema cache
    await client.query(`NOTIFY pgrst, 'reload schema';`);
    console.log("Reloaded PostgREST schema cache.");

  } catch (error) {
    console.error("Error executing query:", error);
  } finally {
    await client.end();
  }
}

run();
