// Script to create admin account in production database
const { Client } = require('pg');

const connectionString = 'postgresql://smarthire_user:kO1GJj5fCv7ZbisucIiIYZ2TslyFERY4@dpg-d77orm94tr6s73d4iivg-a.oregon-postgres.render.com/smarthire_db_2kvp';

async function createAdmin() {
  const client = new Client({
    connectionString: connectionString,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    console.log('Connecting to database...');
    await client.connect();
    console.log('✅ Connected successfully!');

    console.log('Creating admin account...');
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
      console.log('Admin details:', result.rows[0]);
    } else {
      console.log('ℹ️  Admin account already exists');
    }

    // Verify admin exists
    const verify = await client.query('SELECT id, username, email, name FROM "Admins" WHERE username = $1', ['admin']);
    console.log('\n✅ Verified admin account:');
    console.log(verify.rows[0]);

    console.log('\n🎉 Success! You can now login with:');
    console.log('Username: admin');
    console.log('Password: admin123');
    console.log('\n⚠️  IMPORTANT: Change this password after first login!');

  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.code === 'ENOTFOUND') {
      console.log('\n💡 Check your internet connection and database URL');
    } else if (error.code === '42P01') {
      console.log('\n💡 The Admins table does not exist yet. Make sure your backend has run at least once.');
    }
  } finally {
    await client.end();
    console.log('\nConnection closed.');
  }
}

createAdmin();
