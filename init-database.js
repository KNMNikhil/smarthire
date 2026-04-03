// Script to initialize database and create admin account
const { Client } = require('pg');

const connectionString = 'postgresql://smarthire_user:kO1GJj5fCv7ZbisucIiIYZ2TslyFERY4@dpg-d77orm94tr6s73d4iivg-a.oregon-postgres.render.com/smarthire_db_2kvp';

async function initializeDatabase() {
  const client = new Client({
    connectionString: connectionString,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    console.log('🔌 Connecting to database...');
    await client.connect();
    console.log('✅ Connected successfully!\n');

    // Create Admins table
    console.log('📋 Creating Admins table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS "Admins" (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
      );
    `);
    console.log('✅ Admins table ready\n');

    // Insert admin account
    console.log('👤 Creating admin account...');
    const result = await client.query(`
      INSERT INTO "Admins" (username, email, password, name, "createdAt", "updatedAt") 
      VALUES (
        'admin', 
        'admin@rajalakshmi.edu.in', 
        '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYzpLaEg7dO', 
        'System Administrator', 
        NOW(), 
        NOW()
      )
      ON CONFLICT (username) DO NOTHING
      RETURNING id, username, email;
    `);

    if (result.rows.length > 0) {
      console.log('✅ Admin account created successfully!');
      console.log('   ID:', result.rows[0].id);
      console.log('   Username:', result.rows[0].username);
      console.log('   Email:', result.rows[0].email);
    } else {
      console.log('ℹ️  Admin account already exists');
    }

    // Verify admin exists
    const verify = await client.query('SELECT id, username, email, name FROM "Admins" WHERE username = $1', ['admin']);
    if (verify.rows.length > 0) {
      console.log('\n✅ Verified admin account exists:');
      console.log('   Username:', verify.rows[0].username);
      console.log('   Email:', verify.rows[0].email);
      console.log('   Name:', verify.rows[0].name);
    }

    console.log('\n🎉 SUCCESS! Database initialized!\n');
    console.log('═══════════════════════════════════════');
    console.log('You can now login with:');
    console.log('Username: admin');
    console.log('Password: admin123');
    console.log('═══════════════════════════════════════');
    console.log('\n⚠️  IMPORTANT: Change this password after first login!\n');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    if (error.code === 'ENOTFOUND') {
      console.log('💡 Check your internet connection and database URL');
    } else if (error.code === '23505') {
      console.log('💡 Admin account already exists - you can login now!');
    } else {
      console.log('💡 Error code:', error.code);
    }
  } finally {
    await client.end();
    console.log('Connection closed.\n');
  }
}

initializeDatabase();
